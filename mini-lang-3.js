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
  return readline.question(inputParam).toUpperCase();
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
      acc = performLogic(acc, ele, stackParam)
    }

    return acc;
  }, registerParam);
}

function parseRegister(accParam, eleParam) {
  if (eleParam === 'NAN') {
    accParam = NaN;
  } else if (!Number.isNaN(Number(eleParam))) {
    accParam = Number(eleParam);
  } else if (eleParam === 'UNDEFINED') {
    accParam = undefined;
  } else if (eleParam === 'NULL') {
    accParam = null;
  } else if (eleParam === 'TRUE') {
    accParam = true;
  } else if (eleParam === 'FALSE') {
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
    let copiesAndOriginal = stackParam.map((ele, idx) => (idx === 0 ? accParam : accParam.slice())).reverse();
    stackParam.forEach(sub => sub.push(...copiesAndOriginal));
  } else {
    let counterpartsAndOriginal = stackParam.map((ele, idx) => (idx === 0 ? accParam : Object.assign({}, accParam)).reverse();
    stackParam.forEach((sub, idx) => {
      let k = getUserInput(`For object ${idx + 1}, enter 'Y' for CONCRETE or anything else for NONCONCRETE`) === 'Y';
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
    if (idx !== stackParam[stackParam['length'] - 1]) {
      if (sub[sub['length'] - 1] === null || typeof sub[sub['length'] - 1] !== 'object') {
        sub.pop();
      } else if (typeof sub[sub['length'] - 1] === 'object') {
        stackParam.forEach((ele, jdx) => sub.pop());
      }
    } else {
      if (sub['length'] === 0 || sub[sub['length'] - 1] === null || typeof sub[sub['length'] - 1] !== 'object') {
        result = sub.pop();
      } else if (typeof sub[sub['length'] - 1] === 'object') {
        stackParam.forEach((ele, jdx) => {
          if (jdx === 0) {
            result = sub.pop();
          }
          sub.pop();
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
  }


  - 'OR':
    - From the topmost sub-stack,
      - Pop off the topmost value,
      - Check `Boolean(value) || Boolean(register)`, and
      - Store result in register
  - 'CON': (short for 'conditional')
    - From the topmost sub-stack,
      - Pop off the topmost value,
      - Check `!Boolean(value) || Boolean(register)`, and
      - Store result in register
  - 'BCON': (short for 'bi-conditional')
    - From the topmost sub-stack,
      - Pop off the topmost value,
      - Check `Boolean(value) ? Boolean(register) : !Boolean(register)`, and
      - Store result in register

  - 'ID':
    - From the topmost sub-stack,
      - Pop off the topmost value,
      - Check `value === register`, and
      - Store result in register
  - 'OBJECT-EXISTS': (short for 'value is a non-empty, non-null object')
    - From the topmost sub-stack,
      - Pop off the topmost value,
      - Check `(typeof value === 'object' && value !== null && Object.keys(value)['length'] > 0)`, and
      - Store result in register
  - 'OBJECT-CONCRETE': (short for 'value is a concrete, non-null object')
    - From the topmost sub-stack,
      - Pop off the topmost value,
      - Check `(typeof value === 'object' && value !== null && value['K'] === 'CONCRETE')`, and
      - Store result in register
  - 'PRIME-EXISTS': (short for 'value is neither an object nor `NaN`)
    - From the topmost sub-stack,
      - Pop off the topmost value,
      - Check `(typeof value !== 'object' && !Number.isNaN(value))`, and
      - Store result in register




  else if (eleParam === 'EVERY-AND') {
    accParam = stackParam.every(ele => (Boolean(ele) && Boolean(accParam)));
  } else if (eleParam === 'EVERY-NOT-AND') {
    accParam = stackParam.every(ele => !(Boolean(ele) && Boolean(accParam)));
  } else if (eleParam === 'EVERY-OR') {
    accParam = stackParam.every(ele => (Boolean(ele) || Boolean(accParam)));
  } else if (eleParam === 'EVERY-NOT-OR') {
    accParam = stackParam.every(ele => !(Boolean(ele) || Boolean(accParam)));
  } else if (eleParam === 'EVERY-CON') {
    accParam = stackParam.every(ele => (Boolean(!ele) || Boolean(accParam)));
  } else if (eleParam === 'EVERY-NOT-CON') {
    accParam = stackParam.every(ele => !(Boolean(!ele) || Boolean(accParam)));
  } else if (eleParam === 'EVERY-BCON') {
    accParam = stackParam.every(ele => (Boolean(ele) ? Boolean(accParam) : Boolean(!accParam)));
  } else if (eleParam === 'EVERY-NOT-BCON') {
    accParam = stackParam.every(ele => !(Boolean(ele) ? Boolean(accParam) : Boolean(!accParam)));
  } else if (eleParam === 'EVERY-ID') {
    accParam = stackParam.every(ele => ele === accParam);
  } else if (eleParam === 'EVERY-NOT-ID') {
    accParam = stackParam.every(ele => ele !== accParam);
  } else if (eleParam === 'EVERY-OBJECT-EXISTS') {
    accParam = stackParam.every(ele => (typeof ele === 'object' && Object.keys(ele)['length'] > 0));
  } else if (eleParam === 'EVERY-NOT-OBJECT-EXISTS') {
    accParam = stackParam.every(ele => !(typeof ele === 'object' && Object.keys(ele)['length'] > 0));
  } else if (eleParam === 'EVERY-OBJECT-CONCRETE') {
    accParam = stackParam.every(ele => (typeof ele === 'object' && ele['K'] === 'concrete'));
  } else if (eleParam === 'EVERY-NOT-OBJECT-CONCRETE') {
    accParam = stackParam.every(ele => !(typeof value === 'object' && value['K'] === 'concrete'));
  } else if (eleParam === 'EVERY-PRIME-EXISTS') {
    accParam = stackParam.every(ele => (typeof ele !== 'object' && !Number.isNaN(ele)));
  } else if (eleParam === 'EVERY-NOT-PRIME-EXISTS') {
    accParam = stackParam.every(ele => !(typeof ele !== 'object' && !Number.isNaN(ele)));
  }
  return accParam;
}

do {
  console.clear();
  if (toWelcome) {
    console.log('Welcome to JS Logic!'');
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

    keepGoing = getUserInput("Enter 'Y' to continue entering commands; otherwise, enter any key or hit enter to stop.\n") === 'Y';
  } while (keepGoing);

  toRepeat = getUserInput("Enter 'Y' to start with fresh stack; otherwise, enter any key or hit enter to stop.\n") === 'Y';
} while (toRepeat);
