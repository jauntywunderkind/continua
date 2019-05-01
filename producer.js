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
		throw new Error( "must have a function that produces data")
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
		if( self.tickNeeded){
			self.tickNeeded.resolve()
			self.tickNeeded= null
		}
	}

	const self= {
	  // data yielding elements
	  producer, // produces values when a) asked and b) there is an available tick
	  inner: null, // a current run of a producer

	  // tick, on whose interval producer runs
	  tick, // async generator producing ticks
	  ticked: false, // there is an available tick, therefore we can run producer again
	  tickTermination: null, // the conclusion of the tick iterator
	  tickNeeded: null, // a defer, for waiting for a tick to proceed

	  // interlock against run-ahead .next calls
	  last: null, // most recent iteration stored here

	  // iteration members
	  value: null,
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
				// we have to tickNeeded for a tick before we can iterate
				self.tickNeeded= Deferrant()
				// this will throw whatever tick iteration throws if it throws
				await self.tickNeeded
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
			self.inner= null
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
	self.tickTermination= asyncForEach( tick, signalTick).then( function( done){
		if( self.tickNeeded){
			// this seems super arbitrary. probably needs to be an option what to do
			self.tickNeeded.resolve()
		}
		return done
	}, function( err){
		if( self.tickNeeded){
			// whomever is waiting won't get nothing! fail
			self.tickNeeded.reject( err)
		}
		throw err
	})
	return self
}
export default ContinuaProducer
