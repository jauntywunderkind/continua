"use module"
export const
  a= { a: 1},
  b= { b: 2},
  c= { c: 3}

let step= -1
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
	yield {
	  a: 1
	}

	step= 2
	yield b // first b
	yield a
	yield b

	step= 3
	yield {
	  b: 2
	}

	step= 4
	yield c // yield c
	yield a
	yield b
	yield c
	yield a

	step= 5
	yield {
	  c: 3
	}

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

export async function readAhead( iter, n){
	const reads= []
	while( n-- > 0){
		reads.push( iter.next().then( getValue))
	}
	return Promise.all( reads)
}

export async function readAll( iter){
	const reads= []
	for await( const val of iter){
		reads.push( val)
	}
	return reads
}
