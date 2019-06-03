"use module"
export const
  a= { a: 1},
  a2= { a: 1},
  b= { b: 2},
  b2= { b: 2},
  c= { c: 3},
  c2= { c: 3}

export let step= -1

// i thought step was supposed to be mutable but not working for my esm tests? adda  getter
export function getStep(){
	return step
}

/**
* By value:
*   a, b, c
* By reference:
*   a, a, b, b, c, c a
*/
export async function * fixture(){
	step= 0
	yield a // yield a
	yield a

	// yield something that looks like a but is different
	step= 1
	yield a2

	step= 2
	yield b // first b
	yield a
	yield b

	step= 3
	yield b2

	step= 4
	yield c // yield c
	yield a
	yield b
	yield c
	yield a

	step= 5
	yield c2

	// for good measure, another value copy of a
	step= 6
	yield {
	  a: 1
	}

	step= 7
	return 42
}

function getValue( i){
	return i.value
}
