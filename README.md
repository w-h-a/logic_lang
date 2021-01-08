# README #

The program implements a sort of stack-and-register programming language for logical operations in JavaScript. The program is inspired by a stack machine problem that I had to solve for Launch School's JS foundations course. Some of the material below comes from Launch School.

A stack is a list of values that grows and shrinks. A stack-and-register programming language is a language that uses a stack of values. Each operation in the language operates on a register, which can be considered the current value. The register is not part of the stack. The register's value is initialized to `0`.

Programs are supplied to the language via a string. Each of the operations detailed below is self-contained (i.e., operations are not operands of one another) and the syntax of the string argument is that each operation is in uppercase and separated by one whitespace. An object (includes arrays) in the language must use JSON syntax.

## Register-only Operations ##

- 'X': Place any stringified JS value, 'X', into the register.
- 'PRINT': Prints the boolean version of the register value.
- 'NOT': Negates the register value.

All other operations also operate on the stack. The stack in mini-lang-3.js is unique in that it is initialized to include 4 arrays of length 0, which might be thought of as sub-stacks. The stack always includes these 4 sub-stacks. Before listing out the other operations of mini-lang-3.js, it is important to point out that objects (excluding arrays) are treated specially in the language. There are two primitive properties denoted by keys 'K' and 'N', respectively. The K property is either 'concrete' (exclusive) or 'nonconcrete' and the N property corresponds to the object's sub-stack number. The user cannot specify the N property, and if the user does not specify the K property, it will be determined by a random draw.

## PUSH and POP ##

- 'PUSH':
  - If a primitive value is pushed from the register, that value gets copied into every sub-stack.
  - If an array is pushed from the register, then 3 (shallow) copies of the array are made and all 4 arrays are placed into each sub-stack.
  - If an object (excludes arrays) is pushed from the register, then
    - first, it is ensured that the object has the two (shallow) primitive properties,
    - second, 3 (shallow) copies of the value are made,
    - third, for the 3 (shallow) copies the K property is determined by a random draw, and
    - fourth, all 4 arrays are placed into each sub-stack.

- 'POP':
  - If a primitive value is the topmost value of the topmost sub-stack, the value is removed from each of the sub-stacks and placed into the register.
  - If an object (includes arrays) is the topmost value of the topmost sub-stack,
    - the value is placed into the register, and
    - the value _and_ all of its counterparts are removed from each of the sub-stacks.
  - If the topmost item of the topmost sub-stack is empty, `undefined` is placed into the register (i.e., it is possible to work with stacks of length 0).

## Logical Operations for Topmost Item in the Topmost Sub-Stack ##

- 'AND':


AND: Pop a value off of the stack and check conjunction of Boolean(value) and Boolean(register), storing result in register.
OR: Pop a value off of the stack and check disjunction of Boolean(value) and Boolean(register), storing result in register
CON: Pop a value off of the stack and check disjunction of !Boolean(value) and Boolean(register), storing result in register
BCON: Pop a value off of the stack and check Boolean(value) ? Boolean(register) : !Boolean(register)

ID: Pop a value off of the stack and check value === register, storing result in register
TRU: Pop a value off of the stack and check Boolean(value) === true, storing result in register
OBJECT-EXISTS: Pop a value off of the stack and check whether it is an object with properties, storing result in register
OBJECT-CONCRETE: Pop a value off of the stack and check whether it is an object with the concreteness property, storing result in register
PRIM-EXISTS: Pop a value off of the stack and check whether it is a primitive value other than NaN.


## Logical Operations Across All Items in the Topmost Sub-Stack ##






EVERY-AND: Check, for each stack value, (Boolean(value) && Boolean(register)), storing result in register
EVERY-NOT-AND: Check, for each stack value, !(Boolean(value) && Boolean(register)), storing result in register
EVERY-OR: Check, for each stack value, (Boolean(value) || Boolean(register)), storing result in register
EVERY-NOT-OR: Check, for each stack value, !(Boolean(value) || Boolean(register)), storing result in register
EVERY-CON: Check, for each stack value, !Boolean(value) || Boolean(register), storing result in register
EVERY-NOT-CON: Check, for each stack value, !(!Boolean(value) || Boolean(register)), storing result in register
EVERY-BCON: Check, for each stack value, Boolean(value) ? Boolean(register) : !Boolean(register), storing result in register
EVERY-NOT-BCOM: Check, for each stack value, !(Boolean(value) ? Boolean(register) : !Boolean(register)), storing result in register

EVERY-ID: Check, for each stack value, value === register, storing result in register
EVERY-NOT-ID: Check, for each stack value, value !== regiser, storing result in register
EVERY-TRU: Check, for each stack value, Boolean(value) === true, storing result in register
EVERY-NOT-TRU: Check, for each stack value, Boolean(value) !== true, storing result in register
EVERY-OBJECT-EXISTS: Check, for each stack value, value is object w/ properties, storing result in register
EVERY-NOT-OBJECT-EXISTS: Check, for each stack value, value is not object w/ properties, storing result in register
EVERY-OBJECT-CONCRETE: Check, for each stack value, value is concrete object, storing result in register
EVERY-NOT-OBJECT-CONCRETE: Check, for each stack value, value is not concrete object, storing result in register
EVERY-PRIM-EXISTS: Check, for each stack value, value is primitive value other than NaN, storing result in register
EVERY-NOT-PRIM-EXISTS: Check, for each stack value, value is not primitive value other than NaN

SOME-AND: Check, there is a stack value s.t. (Boolean(value) && Boolean(register)), storing result in register
SOME-NOT-AND: Check, there is a stack value s.t. !(Boolean(value) && Boolean(register)), storing result in register
SOME-OR: Check, there is a stack value s.t. (Boolean(value) || Boolean(register)), storing result in register
SOME-NOT-OR: Check, there is a stack value s.t. !(Boolean(value) || Boolean(register)), storing result in register
SOME-CON: Check, there is a stack value s.t. (!Boolean(value) || Boolean(register)), storing result in register
SOME-NOT-CON: Check, there is a stack value s.t. !(!Boolean(value) || Boolean(register)), storing result in register
SOME-BCON: Check, there is a stack value s.t. Boolean(value) ? Boolean(register) : !Boolean(register), storing result in register
SOME-NOT-BCOM: Check, there is a stack value s.t. !(Boolean(value) ? Boolean(register): !Boolean(register)), storing result in register

SOME-ID: Check, there is a stack value s.t. value === register, storing result in register
SOME-NOT-ID: Check, there is a stack value s.t. value !== register, storing result in register
SOME-TRU: Check, there is a stack value s.t. Boolean(value) === true, storing result in register
SOME-NOT-TRU: Check, there is a stack value s.t. Boolean(value) !== true, storing result in register
SOME-OBJECT-EXISTS: Check, there is stack value s.t value is an object w/ properties, storing result in register
SOME-NOT-OBJECT-EXISTS: Check, there is stack value s.t. value is not object w/ properties, storing result in register
SOME-OBJECT-CONCRETE: Check, there is stack value s.t. value is concrete object, storing result in register
SOME-NOT-OBJECT-CONCRETE: Check, there is stack value s.t. value is not concrete object, storing result in register
SOME-PRIM-EXISTS: Check, there is stack value s.t. value is primitive value other than NaN, storing result in register
SOME-NOT-PRIM-EXISTS: Check, there is stack value s.t. value is not primitive value other than NaN


## Logical Operations Across All Sub-Stacks ##




















This might sound complex, but the behavior is straightforward. Consider an OR operation in a stack-and-register language. It removes the topmost value from the stack, determines whether either the stack value or the register value is true, and stores the result back in the register. For example, if we start with a stack [3, true, 0 (where 0 is the topmost element in the stack) and a register value of [], the OR operation selects the 0 from the stack, and the result of the operation, true (after Boolean coercion), is left in the register. If we do another OR at this point, the true is selected from the stack, and the register is left with the value of true.

Consider an ID operation in the language. It removes the topmost value from the stack, determines whether the stack value and the register value are identical, and stores the result back in the register. For example, if we start with a stack [3, true, [3]] and register value of [3], the ID operation selects the [3] from the stack, and the result of the operation, false, is left in the register. If we do another ID at this point, the true is selected from the stack, and the register is left with the value of false. Finally, consider an EVERY-ID operation in the language. It determines whether each stack value and the register value are identical, and stores the result back in the register. For example, if we start with a stack [3, '3', [3]] and register value of [3], the result of the EVERY-ID operation, false, is left in the register.


 


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
