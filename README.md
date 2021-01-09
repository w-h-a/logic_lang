# README #

The program in mini-lang-3.js implements a sort of stack-and-register programming language for logical operations in JavaScript. The program is inspired by a stack machine problem that I had to solve for Launch School's JS foundations course. Some of the material below comes from Launch School.

A stack is a list of values that grows and shrinks. A stack-and-register programming language is a language that uses a stack of values. Each operation in the language operates on a register, which can be considered the current value. The register is not part of the stack. The register's value is initialized to `0`.

Programs are supplied to the language via a string. Each of the operations detailed below is self-contained (i.e., operations are not operands of one another) and the syntax of the string input is such that each operation is in uppercase and separated by one whitespace (e.g., '5 PUSH NOT PRINT'). An object (includes arrays) in the language must use JSON syntax (e.g., '{"K": "NONCONCRETE","essential":{"R": "IRRATIONAL","P":"NON-PERSON"}} PUSH ["BLUE",2,[]] PUSH [] PRINT').

## Register-only Operations ##

- 'X': Place any "stringified" JS value, 'X', into the register.

- 'PRINT': Prints the boolean version of the register value.
- 'NOT': Negates the register value and returns the result to the register.

## PUSH and POP ##

All other operations also operate on the stack. The stack in mini-lang-3.js is unique in that it is initialized to include _n_ arrays of length 0, which might be thought of as sub-stacks. The stack always includes these _n_ sub-stacks. Before listing out the other operations of mini-lang-3.js, it is important to point out that objects (excludes arrays) are treated specially in the language. There is one primitive property denoted by key 'K'. The K property is either 'CONCRETE' (exclusive) or 'NONCONCRETE'. The user must specify the K property.

- 'PUSH':
  - If a null or primitive value is pushed from the register, that value gets copied into every sub-stack. The value stays in the register.
  - If an array is pushed from the register, then
    - first, _n - 1_ (shallow) copies of the value are made,
    - second, all _n_ arrays are placed into each sub-stack, and
    - third, the original value also remains in the register.
  - If an object (excludes arrays) is pushed from the register, then
    - first, _n - 1_ (shallow) copies of the value are made,
    - second, the K property is determined by user's input, and
    - third, all _n_ arrays are placed into each sub-stack.
    - fourth, the original value also remains in the register.
- 'POP':
  - If a null or primitive value is the topmost value of the topmost sub-stack, the value is removed from each of the sub-stacks and placed into the register.
  - If an object (includes arrays) is the topmost value of the topmost sub-stack,
    - the value is placed into the register, and
    - the value _and_ all of its counterparts are removed from each of the sub-stacks.
  - If the topmost item of the topmost sub-stack is empty, `undefined` is placed into the register (i.e., it is possible to work with stacks of length 0).

All of the operations in the next section also perform a sort of popping operation, but it is slightly different from the one above. Whenever I write "Pop off the topmost value", I mean:

- If a primitive value is the topmost value, the value is removed from each of the sub-stacks.
- If an object (includes arrays) is the topmost value, the value _and_ all of its counterparts are removed from each of the sub-stacks.
- If the topmost item is empty, although the item does not have `undefined` in it, `undefined` becomes an operand for the operator.

## Logical Operations for Topmost Item in the Topmost Sub-Stack ##

- 'AND':
  - From the topmost sub-stack,
    - Pop off the topmost value,
    - Check `Boolean(value) && Boolean(register)`, and
    - Store result in register
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

## Logical Operations Across All Items in the Topmost Sub-Stack ##

- 'EVERY-AND':
  - For the topmost sub-stack,
    - Check, `.every(ele => (Boolean(ele) && Boolean(register)))` and
    - Store result in register
- 'EVERY-NOT-AND':
  - For the topmost sub-stack,
    - Check, `.every(ele => !(Boolean(ele) && Boolean(register)))` and
    - Store result in register
- 'EVERY-OR':
  - For the topmost sub-stack,
    - Check, `.every(ele => (Boolean(ele) || Boolean(register)))` and
    - Store result in register
- 'EVERY-NOT-OR':
  - For the topmost sub-stack,
    - Check, `.every(ele => !(Boolean(ele) || Boolean(register)))` and
    - Store result in register
- 'EVERY-CON':
  - For the topmost sub-stack,
    - Check, `.every(ele => (!Boolean(ele) || Boolean(register)))` and
    - Store result in register
- 'EVERY-NOT-CON':
  - For the topmost sub-stack,
    - Check, `.every(ele => !(!Boolean(ele) || Boolean(register)))` and
    - Store result in register
- 'EVERY-BCON':
  - For the topmost sub-stack,
    - Check, `.every(ele => (Boolean(ele) ? Boolean(register) : !Boolean(register)))` and
  - Store result in register
- 'EVERY-NOT-BCON':
  - For the topmost sub-stack,
    - Check, `.every(ele => !(Boolean(ele) ? Boolean(register) : !Boolean(register)))` and
    - Store result in register

- 'EVERY-ID':
  - For the topmost sub-stack,
    - Check, `.every(ele => ele === register)` and
    - Store result in register
- 'EVERY-NOT-ID':
  - For the topmost sub-stack,
    - Check, `.every(ele => ele !== register)` and
    - Store result in register
- 'EVERY-OBJECT-EXISTS':
  - For the topmost sub-stack,
    - Check, `.every(ele => (typeof ele === 'object' && ele !== null && Object.keys(ele)['length'] > 0))` and
    - Store result in register
- 'EVERY-NOT-OBJECT-EXISTS': (short for 'every value is either not an object, null, or empty')
  - For the topmost sub-stack,
    - Check, `.every(ele => !(typeof ele === 'object' && ele !== null && Object.keys(ele)['length'] > 0))` and
    - Store result in register
- 'EVERY-OBJECT-CONCRETE':
  - From the topmost sub-stack,
    - Check, `.every(ele => (typeof value === 'object' && ele !== null && value['K'] === 'CONCRETE'))` and
    - Store result in register
- 'EVERY-NOT-OBJECT-CONCRETE': (short for 'every value is either not an object, null, or nonconcrete')
  - For the topmost sub-stack,
    - Check `.every(ele => !(typeof value === 'object' && ele !== null && value['K'] === 'CONCRETE'))` and
    - Store result in register
- 'EVERY-PRIME-EXISTS':
  - From the topmost sub-stack,
    - Check `.every(ele => (typeof value !== 'object' && !Number.isNaN(value)))` and
    - Store result in register
- 'EVERY-NOT-PRIME-EXISTS': (short for 'every value is either an object or `NaN`')
  - From the topmost sub-stack,
    - Check `.every(ele => !(typeof value !== 'object' && !Number.isNaN(value)))` and
    - Store result in register

The corresponding operations where 'EVERY' is replaced with 'SOME' are also available.

## Logical Operations Across All Sub-Stacks ##

- 'NEC-EVERY-OBJECT-CONCRETE': (short for 'necessarily, every value is a concrete, non-null object')
  - Check, `stack.every(sub => sub.every(ele => (typeof value === 'object' && ele !== null && value['K'] === 'CONCRETE')))` and
  - Store result in register
- 'NEC-EVERY-NOT-OBJECT-CONCRETE': (short for 'necessarily, every value is either not an object, null, or nonconcrete')
  - Check, `stack.every(sub => sub.every(ele => !(typeof value === 'object' && ele !== null && value['K'] === 'CONCRETE')))` and
  - Store result in register
- 'NEC-SOME-OBJECT-CONCRETE': (short for 'necessarily, some value is a concrete, non-null object')
  - Check, `stack.every(sub => sub.some(ele => (typeof value === 'object' && ele !== null && value['K'] === 'CONCRETE')))` and
  - Store result in register
- 'NEC-SOME-NOT-OBJECT-CONCRETE': (short for 'necessarily, some value is either not an object, null, or nonconcrete')
  - Check, `stack.every(sub => sub.some(ele => !(typeof value === 'object' && ele !== null && value['K'] === 'CONCRETE')))` and
  - Store result in register

- 'POS-EVERY-OBJECT-CONCRETE': (short for 'possibly, every value is a concrete, non-null object')
  - Check, `stack.some(sub => sub.every(ele => (typeof value === 'object' && ele !== null && value['K'] === 'CONCRETE')))` and
  - Store result in register
- 'POS-EVERY-NOT-OBJECT-CONCRETE': (short for 'possibly, every value is either not an object, null, or nonconcrete')
  - Check, `stack.some(sub => sub.every(ele => !(typeof value === 'object' && ele !== null && value['K'] === 'CONCRETE')))` and
  - Store result in register
- 'POS-SOME-OBJECT-CONCRETE': (short for 'possibly, some value is a concrete, non-null object')
  - Check, `stack.some(sub => sub.some(ele => (typeof value === 'object' && ele !== null && value['K'] === 'CONCRETE')))` and
  - Store result in register
- 'POS-SOME-NOT-OBJECT-CONCRETE': (short for 'possibly, some value is either not an object, null, or nonconcrete')
  - Check, `stack.some(sub => sub.some(ele => !(typeof value === 'object' && ele !== null && value['K'] === 'CONCRETE')))` and
  - Store result in register

Given the way the program is structured, it is interesting to point out that if any of the operations beginning with 'POS' return true, then the corresponding 'NEC' operation will return true. That was intended but also a result of the fact that I don't know how to model an object x in each stack such that x has different properties in each stack.





Test Cases :

miniLogLang('PRINT'); // => false
miniLogLang('NOT NOT PRINT') // => false
miniLogLang('5 PUSH 3 AND PRINT'); // => true
miniLogLang('5 PRINT NOT PUSH 3 PRINT NOT OR PRINT'); // => true, true, false
miniLogLang('5 PUSH POP PRINT'); // => true
miniLogLang('5 PUSH PRINT'); // => true
miniLogLang("[0] PUSH {P: 2, K: 'concrete'} PUSH 0 PUSH PRINT EVERY-NOT-OBJECT-EXISTS PRINT POP PRINT EVERY-OBJECT-EXISTS PRINT SOME-OBJECT-CONCRETE PRINT"); // => false, true, false, true, true
miniLogLang('6 PUSH'); // => n/a
miniLogLang('PROOF PRINT'); // => true
miniLogLang("1 OR PRINT PUSH ['b'] PUSH SOME-ID PRINT ['b'] SOME-ID PRINT NOT PRINT"); // => true, true, false, true
miniLogLang('true PUSH true PUSH false NOT PUSH SOME-BCON PRINT SOME-NOT-BCON PRINT POP NOT PUSH SOME-NOT-BCON PRINT EVERY-NOT-BCON PRINT'); // => true, false, true, false
miniLogLang('undefined PUSH null PUSH EVERY-NOT-TRUE PRINT true EVERY-NOT-AND PRINT SOME-AND NOT PRINT'); // => true, true, true
miniLogLang('false PUSH true PUSH ID PRINT TRU NOT PRINT'); // => true, true
miniLogLang('false PUSH +0 PUSH NaN PUSH NaN PUSH ID PRINT SOME-PRIM-EXISTS PRINT CON PRINT EVERY-PRIM-EXISTS PRINT'); // => false, true, true, true
miniLogLang('EVERY-OBJECT-EXISTS PRINT EVERY-PRIM-EXISTS PRINT'); // => true, true
miniLogLang('SOME-OBJECT-EXISTS PRINT SOME-PRIM-EXISTS PRINT'); // => false, false

Pseudocode:

for miniLogLang
1. SET stack to array of length 0
2. SET register to 0
3. SET array to split string by whitespace
4. WHILE there are elements in array
  - IF set of operations does not include element
    - SET register to RETURN value of parseRegister function
  ELSE
    - IF element is 'PUSH'
      - SET stack to include value of register
      ELSE IF element is 'POP'
      - SET register to element of stack popped off
      ELSE IF element is 'PRINT'
      - PRINT Boolean(register)
      ELSE IF element is 'NOT'
      - SET register to negation of register
      ELSE
      - SET register to RETURN value of performLogic function

for parseRegister
1. IF element is identical to 'NaN'
  - SET register to NaN
  ELSE IF number version of element is not NaN
  - SET register to number version of element
  ELSE IF element is identical to 'undefined'
  - SET register to undefined
  ELSE IF element is identical to 'null'
  - SET register to null
  ELSE IF element is identical to 'true'
  - SET register to true
  ELSE IF element is identical to 'false'
  - SET register to false
  ELSE IF element includes { or [
  - SET register to JSON.parse(element)
  ELSE
  - SET register to string
2. RETURN register

for performLogic
1. IF element is 'AND'
  - SET stack to remove last element
  - SET register to Boolean(stack element) && Boolean(register)
  ELSE IF element is 'OR'
  - SET stack to remove last element
  - SET register to Boolean(stack element) || Boolean(register)
  ELSE IF element is 'CON'
  - SET stack to remove last element
  - SET register to !Boolean(stack element) || Boolean(register)
  ELSE IF element is 'BCON'
  - SET stack to remove last element
  - SET register to Boolean(stack element) ? Boolean(register) : !Boolean(register)
  ELSE IF element is 'ID'
  - SET stack to remove last element
  - SET register to stack value === register
  ELSE IF element is 'TRU'
  - SET stack to remove last element
  - SET register to Boolean(stack element) === true
  ELSE IF element is 'OBJECT-EXISTS'
  - SET stack to remove last element
  - SET register to result of whether stack value is an object with properties
  ELSE IF element is 'OBJECT-CONCRETE'
  - SET stack to remove last element
  - SET register to result of whether stack value is an object with concreteness property
  ELSE IF element is 'PRIM-EXISTS'
  - SET stack to remove last element
  - SET register to result of whether stack value is a primitive value and not NaN
  ELSE IF element is 'EVERY-AND'
  - SET register to result of stack.every(ele => (Boolean(ele) && Boolean(register)))
  ELSE IF element is 'EVERY-NOT-AND'
  - SET register to result of stack.every(ele => !(Boolean(ele) && Boolean(register)))
  ELSE IF element is 'EVERY-OR'
  - SET register to result of stack.every(ele => (Boolean(ele) || Boolean(register)))
  ELSE IF element is 'EVERY-NOT-OR'
  - SET register to result of stack.every(ele => !(Boolean(ele) || Boolean(register)))
  ELSE IF element is 'EVERY-CON'
  - SET register to result of stack.every(ele => (!Boolean(ele) || Boolean(register)))
  ELSE IF element is 'EVERY-NOT-CON'
  - SET register to result of stack.every(ele => !(!Boolean(ele) || Boolean(register)))
  ELSE IF element is 'EVERY-BCON'
  - SET register to result of stack.every(ele => (Boolean(ele) ? Boolean(register) : !Boolean(register)))
  ELSE IF element is 'EVERY-NOT-BCON'
  - SET register to result of stack.every(ele => !(Boolean(ele) ? Boolean(register) : !Boolean(register)))
  ELSE IF element is 'EVERY-ID'
  - SET register to result of stack.every(ele => ele === register)
  ELSE IF element is 'EVERY-NOT-ID'
  - SET register to result of stack.every(ele => ele !== register)
  ELSE IF element is 'EVERY-TRU'
  - SET register to result of stack.every(ele => Boolean(ele) === true)
  ELSE IF element is 'EVERY-NOT-TRU'
  - SET register to result of stack.every(ele => Boolean(ele) !== true)
  ELSE IF element is 'EVERY-OBJECT-EXISTS'
  - SET register to result of stack.every(ele => Object.keys(ele)['length'] > 0)
  ELSE IF element is 'EVERY-NOT-OBJECT-EXISTS'
  - SET register to result of stack.every(ele => Object.keys(ele)['length'] === 0)
  ELSE IF element is 'EVERY-OBJECT-CONCRETE'
  - SET register to result of stack.every(ele => Object.value(ele).includes('concrete'))
  ELSE IF element is 'EVERY-NOT-OBJECT-CONCRETE'
  - SET register to result of stack.every(ele => !Object.values(ele).includes('concrete'))
  ELSE IF element is 'EVERY-PRIM-EXISTS'
  - SET register to result of stack.every(ele => (typeof ele !== 'object' && !Number.isNaN(ele)))
  ELSE IF element is 'EVERY-NOT-PRIM-EXISTS'
  - SET register to result of stack.every(ele => !(typeof ele !== 'object' && !Number.isNaN(ele)))
  ELSE IF element is 'SOME-AND'
  - SET register to result of stack.some(ele => (Boolean(ele) && Boolean(register)))
  ELSE IF element is 'SOME-NOT-AND'
  - SET register to result of stack.some(ele => !(Boolean(ele) && Boolean(register)))
  ELSE IF element is 'SOME-OR'
  - SET register to result of stack.some(ele => (Boolean(ele) || Boolean(register)))
  ELSE IF element is 'SOME-NOT-OR'
  - SET register to result of stack.some(ele => !(Boolean(ele) || Boolean(register)))
  ELSE IF element is 'SOME-CON'
  - SET register to result of stack.some(ele => (!Boolean(ele) || Boolean(register)))
  ELSE IF element is 'SOME-NOT-CON'
  - SET register to result of stack.some(ele => !(!Boolean(ele) || Boolean(register)))
  ELSE IF element is 'SOME-BCON'
  - SET register to result of stack.some(ele => (Boolean(ele) ? Boolean(register) : !Boolean(register)))
  ELSE IF element is 'SOME-NOT-BCON'
  - SET register to result of stack.some(ele => !(Boolean(ele) ? Boolean(register) : !Boolean(register)))
  ELSE IF element is 'SOME-ID'
  - SET register to result of stack.some(ele => ele === register)
  ELSE IF element is 'SOME-NOT-ID'
  - SET register to result of stack.some(ele => ele !== register)
  ELSE IF element is 'SOME-TRU'
  - SET register to result of stack.some(ele => Boolean(ele) === true)
  ELSE IF element is 'SOME-NOT-TRU'
  - SET register to result of stack.some(ele => Boolean(ele) !== true)
  ELSE IF element is 'SOME-OBJECT-EXISTS'
  - SET register to result of stack.some(ele => Object.keys(ele)['length'] > 0)
  ELSE IF element is 'SOME-NOT-OBJECT-EXISTS'
  - SET register to result of stack.some(ele => Object.keys(ele)['length'] === 0)
  ELSE IF element is 'SOME-OBJECT-CONCRETE'
  - SET register to result of stack.some(ele => Object.value(ele).includes('concrete'))
  ELSE IF element is 'SOME-NOT-OBJECT-CONCRETE'
  - SET register to result of stack.some(ele => !Object.values(ele).includes('concrete'))
  ELSE IF element is 'SOME-PRIM-EXISTS'
  - SET register to result of stack.some(ele => (typeof ele !== 'object' && !Number.isNaN(ele)))
  ELSE IF element is 'SOME-NOT-PRIM-EXISTS'
  - SET register to result of stack.some(ele => !(typeof ele !== 'object' && !Number.isNaN(ele)))
2. RETURN register
