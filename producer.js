"use module"
import asyncForEach from "async-iter-static/forEach.js"
import Deferrant from "deferrant"

import _tick from "./tick.js"

/**
* Periodically re-run an iterable producing function & emit all of it's values
*/
export async function ContinuaProducer({
  producer, // required
  start= true,
  consumeSync= false,
  consumeAsync= false,
  tick= _tick,
  resetOnTick= false,
  ...opts
}){
	if( !producer){
		console.log( "must have a function that produces data")
	}

	if( tick.then){
		tick= await tick
		if( tick.default){
			tick= tick.default
		}
		// tick should now be an async iterable
	}
	tick= tick( opts)

	function signalTick(){
		self.ticked= true
		if( self.wait){
			self.wait.resolve()
			self.wait= undefined
		}
	}

	const self= {
	  producer,
	  tick,
	  ticked: false,
	  tickStatus: undefined, // promise to capture the conclusion of the tick
	  inner: undefined,
	  awaitTick: undefined, // waiting for a tick to proceed
	  last: undefined, // most recent iteration stored here

	  value: undefined,
	  done: false,
	  next: async function(){
		const
		  previous= self.last,
		  current= Deferrant()
		self.last= current
		if( previous){
			// only dispatch one at a time
			await previous
			// this might need/be helped by a setImmediate, to let drain?
		}

		// reset-on-tick preempts any current execution
		if( resetOnTick&& self.ticked){
			// forget any iteration that we are up to, start again
			self.inner= null
		}

		// start a new iteration if we need to
		if( !self.inner){
			if( !self.ticked){
				// we have to awaitTick for a tick before we can iterate
				self.awaitTick= Deferrant()
				await self.awaitTick
			}

			// we have a tick, but no current iteration: start an iteration
			const iterable= self.producer()
			if( consumeAsync){
				self.inner= iterable[ Symbol.asyncIterator]()
			}else if( consumeSync){
				self.inner= iterable[ Symbol.iterator]()
			}else{
				self.inner= (iterable[ Symbol.asyncIterator]|| iterable[ Symbol.iterator]).call( iterable)
			}
			// consume this tick
			self.ticked= false
		}

		// iterate
		const next= await self.inner.next()
		if( next.done){
			// loop again
			current.resolve() // resolve, so we can iterate again
			return self.next()
		}else{
			// save this value!
			self.value= next.value
			current.resolve( self)
			return current
		}
	  }
	}

	// begin
	if( start){
		// kick off immediately
		signalTick()
	}
	self.tickStatus= asyncForEach( tick, signalTick)

	return self
}
export default ContinuaProducer
