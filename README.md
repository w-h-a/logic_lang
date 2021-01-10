# README #

The program in mini-lang-3.js implements a sort of stack-and-register programming language for logical operations in JavaScript. The program is inspired by a stack machine problem that I had to solve for Launch School's JS foundations course. Some of the material below comes from Launch School.

A stack is a list of values that grows and shrinks. A stack-and-register programming language is a language that uses a stack of values. Each operation in the language operates on a register, which can be considered the current value. The register is not part of the stack. The register's value is initialized to `0`.

Programs are supplied to the language via a string. Each of the operations detailed below is self-contained (i.e., operations are not operands of one another) and the syntax of the string input is such that each operation is in uppercase and separated by one whitespace (e.g., '5 PUSH NOT'). An object (includes arrays) in the language must use JSON syntax (e.g., '{"K":"NONCONCRETE","necessary":{"P":0,"T":true}} PUSH ["BLUE",2,[],null] PUSH [] BOOL').

## Register-only Operations ##

- 'X': Place any "stringified" JS value, 'X', into the register.

- 'BOOL': Booleanizes the register value.
- 'NOT': Negates the register value and returns the result to the register.

## PUSH and POP ##

All other operations also operate on the stack. The stack in mini-lang-3.js is unique in that it is initialized to include _n_ arrays of length 0, which might be thought of as sub-stacks. The stack always includes these _n_ sub-stacks. Before listing out the other operations of mini-lang-3.js, it is important to point out that objects (excludes arrays) are treated specially in the language. There is one primitive property denoted by key 'K'. The K property is either 'CONCRETE' (exclusive) or 'NONCONCRETE'. The user must specify the K property. Indeed, the user is asked, for each sub-stack, whether the object "of the sub-stack" is to be CONCRETE or NONCONCRETE. Although each object will ultimately be included in each sub-stack, each time an object is pushed to the stack, there is a unique object that is "of the sub-stack".

If one likes, one can think of this in the following way. For simplicity, assume _n = 2_. Think of sub-stacks as worlds, where the topmost sub-stack is the actual world. So, sub-stack 2 is the actual world. Think of JavaScript objects as representations of ordinary objects at a world. For example, suppose I've created a weird JS logic program but there is a world in which I have not created a weird JS logic program. In that case, then there must be one JS object _a_ that represents me at world 1 and another distinct JS object _b_ that represents me at world 2. Even though both JS objects are included in every sub-stack, JS object _a_ represents me-at-world-1 and JS object _b_ represents me-at-world-2. Hence, no matter where a JS object is, it represents me "of a unique world" and that is why we may say that there is a JS object that is "of the sub-stack".

- 'PUSH':  
  - If a null or primitive value is pushed from the register, that value gets copied into every sub-stack. The value stays in the register.
  - If an array is pushed from the register, then
    - first, _n - 1_ (shallow) copies of the value are made,
    - second, all _n_ arrays are placed into each sub-stack such that the original is the topmost, and
    - third, the original value also remains in the register.
  - If an object (excludes arrays) is pushed from the register, then
    - first, _n - 1_ (shallow) copies of the value are made,
    - second, the K property is determined by user's input.
    - third, all _n_ objects are placed into each sub-stack such that the original is the topmost, and
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

=====================================================================================

Examples:

- '`anyvalue` PUSH CON' // => true
- '`falsy` BOOL NOT' // => true
- '`truthy` PUSH `anyvalue` OR' // => true
- '`truthy` NOT PUSH `anyvalue` CON' // => true
- '`truthy` PUSH `truthy` CON' // => true
- '`falsy` PUSH `anyvalue` CON' // true
- '`truthy` PUSH BCON' // => true
- '`falsy` PUSH BCON' // => true
- '`truthy` PUSH `falsy` NOT AND PUSH NOT CON NOT' // => true

=====================================================================================

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

=====================================================================================

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

=====================================================================================

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

Given the way the program is structured, it is interesting to point out that if any of the operations beginning with 'POS' return true, then the corresponding 'NEC' operation will return true. That was intended but also a result of the fact that I don't know how to model an object x such that x has different properties in each stack.
