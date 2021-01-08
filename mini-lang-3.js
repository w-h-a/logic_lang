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

}

function toPop(stackParam) {

}

function performLogic(accParam, eleParam, stackParam) {
  if (eleParam === 'AND') {
    accParam = Boolean(stackParam.pop()) && Boolean(accParam);
  } else if (eleParam === 'OR') {
    accParam = Boolean(stackParam.pop()) || Boolean(accParam);
  } else if (eleParam === 'CON') {
    accParam = Boolean(!stackParam.pop()) || Boolean(accParam);
  } else if (eleParam === 'BCON') {
    accParam = Boolean(stackParam.pop()) ? Boolean(accParam) : Boolean(!accParam);
  } else if (eleParam === 'ID') {
    accParam = stackParam.pop() === accParam;
  } else if (eleParam === 'OBJECT-EXISTS') {
    let value = stackParam.pop();
    accParam = (typeof value === 'object' && Object.keys(value)['length'] > 0);
  } else if (eleParam === 'OBJECT-CONCRETE') {
    let value = stackParam.pop();
    accParam = (typeof value === 'object' && value['K'] === 'concrete');
  } else if (eleParam === 'PRIME-EXISTS') {
    let value = stackParam.pop();
    accParam = (typeof value !== 'object' && Number.isNaN(value));
  } else if (eleParam === 'EVERY-AND') {
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
