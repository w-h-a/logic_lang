let toWelcome = true;
let toRepeat;
let readline = require('readline-sync');
let minSubStackNum = 2;

let operations = [
  'PRINT', 'NOT',
  'PUSH', 'POP',
  'AND', 'OR', 'CON', 'BCON',
  'ID', 'OBJECT-EXISTS', 'OBJECT-CONCRETE', 'PRIME-EXISTS',
  'EVERY-AND', 'EVERY-NOT-AND', 'EVERY-OR', 'EVERY-NOT-OR',
  'EVERY-CON', 'EVERY-NOT-CON', 'EVERY-BCON', 'EVERY-NOT-BCON',
  'EVERY-ID', 'EVERY-NOT-ID',
  'EVERY-OBJECT-EXISTS', 'EVERY-NOT-OBJECT-EXISTS',
  'EVERY-OBJECT-CONCRETE', 'EVERY-NOT-OBJECT-CONCRETE',
  'EVERY-PRIME-EXISTS', 'EVERY-NOT-PRIME-EXISTS',
  'SOME-AND', 'SOME-NOT-AND', 'SOME-OR', 'SOME-NOT-OR',
  'SOME-CON', 'SOME-NOT-CON', 'SOME-BCON', 'SOME-NOT-BCON',
  'SOME-ID', 'SOME-NOT-ID',
  'SOME-OBJECT-EXISTS', 'SOME-NOT-OBJECT-EXISTS',
  'SOME-OBJECT-CONCRETE', 'SOME-NOT-OBJECT-CONCRETE',
  'SOME-PRIME-EXISTS', 'SOME-NOT-PRIME-EXISTS',
  'NEC-EVERY-OBJECT-CONCRETE', 'NEC-EVERY-NOT-OBJECT-CONCRETE',
  'NEC-SOME-OBJECT-CONCRETE', 'NEC-SOME-NOT-OBJECT-CONCRETE',
  'POS-EVERY-OBJECT-CONCRETE', 'POS-EVERY-NOT-OBJECT-CONCRETE',
  'POS-SOME-OBJECT-CONCRETE', 'POS-SOME-NOT-OBJECT-CONCRETE'
];

function getUserInput(inputParam) {
  return readline.question(inputParam);
}

function miniLogLang(commandLineParam, registerParam, stackParam) {
  return commandLineParam.split(' ').reduce((acc, ele) => {
    if (!operations.includes(ele)) {
      acc = parseRegister(acc, ele);
    }

    if (ele === 'PRINT') {
      console.log(Boolean(acc));
    } else if (ele === 'NOT') {
      acc = !acc;
    } else if (ele === 'PUSH') {
      toPush(acc, stackParam);
    } else if (ele === 'POP') {
      acc = toPop(stackParam);
    } else {
      acc = performLogic(acc, ele, stackParam);
    }

    return acc;
  }, registerParam);
}

function parseRegister(accParam, eleParam) {
  if (eleParam === 'NaN') {
    accParam = NaN;
  } else if (!Number.isNaN(Number(eleParam))) {
    accParam = Number(eleParam);
  } else if (eleParam === 'undefined') {
    accParam = undefined;
  } else if (eleParam === 'null') {
    accParam = null;
  } else if (eleParam === 'true') {
    accParam = true;
  } else if (eleParam === 'false') {
    accParam = false;
  } else if (eleParam.includes('{') || eleParam.includes('[')) {
    accParam = JSON.parse(eleParam);
  } else {
    accParam = eleParam;
  }
  return accParam;
}

function toPush(accParam, stackParam) {
  if (accParam === null || typeof accParam !== 'object') {
    stackParam.forEach(sub => sub.push(accParam));
  } else if (Array.isArray(accParam)) {
    let copiesAndOriginal = stackParam.map((_, idx) => (idx === 0 ? accParam : accParam.slice())).reverse();
    stackParam.forEach(sub => sub.push(...copiesAndOriginal));
  } else {
    let counterpartsAndOriginal = stackParam.map((_, idx) => (idx === 0 ? accParam : Object.assign({}, accParam))).reverse();
    stackParam.forEach((sub, idx) => {
      let k = getUserInput(`For object of sub-stack ${idx + 1}, enter 'Y' for CONCRETE or anything else for NONCONCRETE (NOTE: the original object will be the last one)\n`).toUpperCase() === 'Y';
      if (k) {
        counterpartsAndOriginal[idx]['K'] = 'CONCRETE';
      } else {
        counterpartsAndOriginal[idx]['K'] = 'NONCONCRETE';
      }
      sub.push(...counterpartsAndOriginal);
    });
  }
}

function toPop(stackParam) {
  let result;
  stackParam.forEach((sub, idx) => {
    if (idx !== (stackParam['length'] - 1)) {
      if (sub[sub['length'] - 1] === null || typeof sub[sub['length'] - 1] !== 'object') {
        sub.pop();
      } else if (typeof sub[sub['length'] - 1] === 'object') {
        stackParam.forEach(_ => sub.pop());
      }
    } else {
      if (sub['length'] === 0 || sub[sub['length'] - 1] === null || typeof sub[sub['length'] - 1] !== 'object') {
        result = sub.pop();
      } else if (typeof sub[sub['length'] - 1] === 'object') {
        stackParam.forEach((_, jdx) => {
          if (jdx === 0) {
            result = sub.pop();
          } else {
            sub.pop();
          }
        });
      }
    }
  });
  return result;
}

function performLogic(accParam, eleParam, stackParam) {
  if (eleParam === 'AND') {
    let leftOperand = toPop(stackParam);
    accParam = Boolean(leftOperand) && Boolean(accParam);
  } else if (eleParam === 'OR') {
    let leftOperand = toPop(stackParam);
    accParam = Boolean(leftOperand) || Boolean(accParam);
  } else if (eleParam === 'CON') {
    let leftOperand = toPop(stackParam);
    accParam = !Boolean(leftOperand) || Boolean(accParam);
  } else if (eleParam === 'BCON') {
    let leftOperand = toPop(stackParam);
    accParam = Boolean(leftOperand) ? Boolean(accParam) : !Boolean(accParam);
  } else if (eleParam === 'ID') {
    let leftOperand = toPop(stackParam);
    accParam = leftOperand === accParam;
  } else if (eleParam === 'OBJECT-EXISTS') {
    let operand = toPop(stackParam);
    accParam = (typeof operand === 'object' && operand !== null && Object.keys(operand)['length'] > 0);
  } else if (eleParam === 'OBJECT-CONCRETE') {
    let operand = toPop(stackParam);
    accParam = (typeof operand === 'object' && operand !== null && operand['K'] === 'CONCRETE');
  } else if (eleParam === 'PRIME-EXISTS') {
    let operand = toPop(stackParam);
    accParam = (typeof operand !== 'object' && !Number.isNaN(operand));
  } else if (eleParam === 'EVERY-AND') {
    accParam = stackParam[stackParam['length'] - 1].every(ele => (Boolean(ele) && Boolean(accParam)));
  } else if (eleParam === 'EVERY-NOT-AND') {
    accParam = stackParam[stackParam['length'] - 1].every(ele => !(Boolean(ele) && Boolean(accParam)));
  } else if (eleParam === 'EVERY-OR') {
    accParam = stackParam[stackParam['length'] - 1].every(ele => (Boolean(ele) || Boolean(accParam)));
  } else if (eleParam === 'EVERY-NOT-OR') {
    accParam = stackParam[stackParam['length'] - 1].every(ele => !(Boolean(ele) || Boolean(accParam)));
  } else if (eleParam === 'EVERY-CON') {
    accParam = stackParam[stackParam['length'] - 1].every(ele => (Boolean(!ele) || Boolean(accParam)));
  } else if (eleParam === 'EVERY-NOT-CON') {
    accParam = stackParam[stackParam['length'] - 1].every(ele => !(Boolean(!ele) || Boolean(accParam)));
  } else if (eleParam === 'EVERY-BCON') {
    accParam = stackParam[stackParam['length'] - 1].every(ele => (Boolean(ele) ? Boolean(accParam) : Boolean(!accParam)));
  } else if (eleParam === 'EVERY-NOT-BCON') {
    accParam = stackParam[stackParam['length'] - 1].every(ele => !(Boolean(ele) ? Boolean(accParam) : Boolean(!accParam)));
  } else if (eleParam === 'EVERY-ID') {
    accParam = stackParam[stackParam['length'] - 1].every(ele => ele === accParam);
  } else if (eleParam === 'EVERY-NOT-ID') {
    accParam = stackParam[stackParam['length'] - 1].every(ele => ele !== accParam);
  } else if (eleParam === 'EVERY-OBJECT-EXISTS') {
    accParam = stackParam[stackParam['length'] - 1].every(ele => (typeof ele === 'object' && ele !== null && Object.keys(ele)['length'] > 0));
  } else if (eleParam === 'EVERY-NOT-OBJECT-EXISTS') {
    accParam = stackParam[stackParam['length'] - 1].every(ele => !(typeof ele === 'object' && ele !== null && Object.keys(ele)['length'] > 0));
  } else if (eleParam === 'EVERY-OBJECT-CONCRETE') {
    accParam = stackParam[stackParam['length'] - 1].every(ele => (typeof ele === 'object' && ele !== null && ele['K'] === 'CONCRETE'));
  } else if (eleParam === 'EVERY-NOT-OBJECT-CONCRETE') {
    accParam = stackParam[stackParam['length'] - 1].every(ele => !(typeof ele === 'object' && ele !== null && ele['K'] === 'CONCRETE'));
  } else if (eleParam === 'EVERY-PRIME-EXISTS') {
    accParam = stackParam[stackParam['length'] - 1].every(ele => (typeof ele !== 'object' && !Number.isNaN(ele)));
  } else if (eleParam === 'EVERY-NOT-PRIME-EXISTS') {
    accParam = stackParam[stackParam['length'] - 1].every(ele => !(typeof ele !== 'object' && !Number.isNaN(ele)));
  } else if (eleParam === 'SOME-AND') {
    accParam = stackParam[stackParam['length'] - 1].some(ele => (Boolean(ele) && Boolean(accParam)));
  } else if (eleParam === 'SOME-NOT-AND') {
    accParam = stackParam[stackParam['length'] - 1].some(ele => !(Boolean(ele) && Boolean(accParam)));
  } else if (eleParam === 'SOME-OR') {
    accParam = stackParam[stackParam['length'] - 1].some(ele => (Boolean(ele) || Boolean(accParam)));
  } else if (eleParam === 'SOME-NOT-OR') {
    accParam = stackParam[stackParam['length'] - 1].some(ele => !(Boolean(ele) || Boolean(accParam)));
  } else if (eleParam === 'SOME-CON') {
    accParam = stackParam[stackParam['length'] - 1].some(ele => (Boolean(!ele) || Boolean(accParam)));
  } else if (eleParam === 'SOME-NOT-CON') {
    accParam = stackParam[stackParam['length'] - 1].some(ele => !(Boolean(!ele) || Boolean(accParam)));
  } else if (eleParam === 'SOME-BCON') {
    accParam = stackParam[stackParam['length'] - 1].some(ele => (Boolean(ele) ? Boolean(accParam) : Boolean(!accParam)));
  } else if (eleParam === 'SOME-NOT-BCON') {
    accParam = stackParam[stackParam['length'] - 1].some(ele => !(Boolean(ele) ? Boolean(accParam) : Boolean(!accParam)));
  } else if (eleParam === 'SOME-ID') {
    accParam = stackParam[stackParam['length'] - 1].some(ele => ele === accParam);
  } else if (eleParam === 'SOME-NOT-ID') {
    accParam = stackParam[stackParam['length'] - 1].some(ele => ele !== accParam);
  } else if (eleParam === 'SOME-OBJECT-EXISTS') {
    accParam = stackParam[stackParam['length'] - 1].some(ele => (typeof ele === 'object' && ele !== null && Object.keys(ele)['length'] > 0));
  } else if (eleParam === 'SOME-NOT-OBJECT-EXISTS') {
    accParam = stackParam[stackParam['length'] - 1].some(ele => !(typeof ele === 'object' && ele !== null && Object.keys(ele)['length'] > 0));
  } else if (eleParam === 'SOME-OBJECT-CONCRETE') {
    accParam = stackParam[stackParam['length'] - 1].some(ele => (typeof ele === 'object' && ele !== null && ele['K'] === 'CONCRETE'));
  } else if (eleParam === 'SOME-NOT-OBJECT-CONCRETE') {
    accParam = stackParam[stackParam['length'] - 1].some(ele => !(typeof ele === 'object' && ele !== null && ele['K'] === 'CONCRETE'));
  } else if (eleParam === 'SOME-PRIME-EXISTS') {
    accParam = stackParam[stackParam['length'] - 1].some(ele => (typeof ele !== 'object' && !Number.isNaN(ele)));
  } else if (eleParam === 'SOME-NOT-PRIME-EXISTS') {
    accParam = stackParam[stackParam['length'] - 1].some(ele => !(typeof ele !== 'object' && !Number.isNaN(ele)));
  } else if (eleParam === 'NEC-EVERY-OBJECT-CONCRETE') {
    accParam = stackParam.every(sub => sub.every(ele => (typeof ele === 'object' && ele !== null && ele['K'] === 'CONCRETE')));
  } else if (eleParam === 'NEC-EVERY-NOT-OBJECT-CONCRETE') {
    accParam = stackParam.every(sub => sub.every(ele => !(typeof ele === 'object' && ele !== null && ele['K'] === 'CONCRETE')));
  } else if (eleParam === 'NEC-SOME-OBJECT-CONCRETE') {
    accParam = stackParam.every(sub => sub.some(ele => (typeof ele === 'object' && ele !== null && ele['K'] === 'CONCRETE')));
  } else if (eleParam === 'NEC-SOME-NOT-OBJECT-CONCRETE') {
    accParam = stackParam.every(sub => sub.some(ele => !(typeof ele === 'object' && ele !== null && ele['K'] === 'CONCRETE')));
  } else if (eleParam === 'POS-EVERY-OBJECT-CONCRETE') {
    accParam = stackParam.some(sub => sub.every(ele => (typeof ele === 'object' && ele !== null && ele['K'] === 'CONCRETE')));
  } else if (eleParam === 'POS-EVERY-NOT-OBJECT-CONCRETE') {
    accParam = stackParam.some(sub => sub.every(ele => !(typeof ele === 'object' && ele !== null && ele['K'] === 'CONCRETE')));
  } else if (eleParam === 'POS-SOME-OBJECT-CONCRETE') {
    accParam = stackParam.some(sub => sub.some(ele => (typeof ele === 'object' && ele !== null && ele['K'] === 'CONCRETE')));
  } else if (eleParam === 'POS-SOME-NOT-OBJECT-CONCRETE') {
    accParam = stackParam.some(sub => sub.some(ele => !(typeof ele === 'object' && ele !== null && ele['K'] === 'CONCRETE')));
  }

  return accParam;
}

do {
  console.clear();
  if (toWelcome) {
    console.log('Welcome to JS Logic!');
    toWelcome = false;
  }

  let subStacks = getUserInput("How many sub-stacks do you want?\n");

  while (!(parseInt(subStacks, 10) >= minSubStackNum)) {
    console.log("Must be an integer larger than 1\n");
    subStacks = getUserInput();
  }

  let register = 0;
  let stack = [];
  let idx = 0;

  while (idx < subStacks) {
    stack.push([]);
    idx += 1;
  }

  let keepGoing;

  do {
    let commandLine = getUserInput("Enter command\n=> ");

    register = miniLogLang(commandLine, register, stack);
    stack.slice().forEach((_, idx) => console.log(`Sub-stack ${stack['length'] - idx}`, stack[stack['length'] - (idx + 1)].slice().reverse()));
    console.log("Register:", register);

    keepGoing = getUserInput("Enter 'Y' to continue entering commands; otherwise, enter any key or hit enter to stop.\n").toUpperCase() === 'Y';
  } while (keepGoing);

  toRepeat = getUserInput("Enter 'Y' to start with fresh stack; otherwise, enter any key or hit enter to stop.\n").toUpperCase() === 'Y';
} while (toRepeat);
