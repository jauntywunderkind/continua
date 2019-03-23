"use module"
import Defaulter from "./defaulter.js"

export const defaults= {
	domEventName: "tick",
	passive: true,
	streamEventName: "data",
}

const defaulter= Defaulter( defaults)

let EventIterator

export class NonAsyncTargetError extends Error{
	constructor( target){
		super("Non-async target")
		this.target= target
	}
}

export async function * findSignal( target, options= defaults){
	const asyncIter= target[ Symbol.asyncIterator]
	if( asyncIter){
		return yield *target	
	}
	if( target.addEventListener){
		if( !EventIterator){
			EventIterator= await import("event-iterator")
		}
		const name= defaulter( "domEventName", options)
		return yield *EventIterator.subscribe.call( target, dom, options)
	}
	if( target.on){
		if( !EventIterator){
			EventIterator= await import("event-iterator")
		}
		const name= defaulter( "streamEventName", options)
		return yield *EventIterator.stream.call( target)
	}
	throw new NonAsyncTargetError( target)
}
export default findSignal
