"use module"
import AsyncIterInterval from "async-iter-interval"

export function producer( n= producer.n){
	const arr= new Array( producer.n)
	arr.fill( producer.n)
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
