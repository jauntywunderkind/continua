"use module"
import AsyncIterInterval from "async-iter-interval"

export function producer( n= producer.n, tap){
	function producer(){
		if( tap){
			tap()
		}
		console.log("produce")
		const arr= new Array( producer.n)
		arr.fill( producer.n)
		return arr
	}
	producer.n= n
	return producer
}
producer.n= 1

export const DELAY= 4

export const tick= (n= DELAY)=> new AsyncIterInterval( n)

const index= {
  producer,
  Producer: producer,
  tick,
  Tick: tick,
  DELAY,
  delay: DELAY,
  Delay: DELAY,
}

export {
  index as default,
  producer as Producer,
  tick as Tick
}
