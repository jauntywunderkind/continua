"use module"
import AsyncIterInterval from "async-iter-interval"
import delay from "delay"

export function producer( n= producer.n, tap){
	function producer(){
		if( tap){
			tap()
		}
		const arr= new Array( producer.n)
		arr.fill( producer.n)
		producer.n++
		return arr
	}
	producer.n= n
	return producer
}
producer.n= 1

export const DELAY= 10

export const tick1= (n= DELAY)=> new AsyncIterInterval( n)
export function tick2(n){
	return async function *(){
		yield true;
		await delay(10)
		yield true;
		await delay(10)
		yield true;
		await delay(10)
	}
}
export const tick= tick1

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
