"use module"
export function producer( n= generator.n){
	const arr= new Array( generator.n)
	arr.fill( generator.n)
	return arr
}
producer.n= 1

export const tick= (n= 5)=> new AsyncIterInterval( n)

const index= {
  producer,
  Producer: producer,
  tick,
  Tick: tick
}

export {
  index as default,
  producer as Producer,
  tick as Tick
}
