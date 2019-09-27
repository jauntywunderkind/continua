"use module"
import AsyncIterPipe from "async-iter-pipe/async-iter-pipe.js"

export function TickListener( ticker, factory, opts){
	// save state
	this.ticker= ticker
	this.factory= factory
	this.tickIterator: ticker[ Symbol.asyncIteration]()
	// start loop
	this.tickLooper= factory._tickLooper( this)
	return this
}
TickListener.prototype.listenersIndex= function(){
	return this.factory.listeners.indexOf( this)
}
TickListener.prototype.remove= function(){
	// clean up tick iterator
	let done
	if( this.tickIterator&& this.tickIterator.return){
		done= this.tickIterator.return()
	}

	// clean self up out of factory
	this.factory.listeners.remove( this)

	// return whence all cleaned up
	return done|| Promise.resolve()
}

export class FactoryContinua extends AsyncIterPipe{
	listeners= []
	run= null
	rerun= false
	constructor( producer, tick, opts= {}){
		super( opts)
		this.producer= producer
		if( tick){
			this.listenToTick( tick)
		}
	}

	async listenToTick( ticker, opts){
		const listener= new TickListener( this, ticker, opts)
		this.listeners.push( listener)
		return listener
	}

	/**
	* Keep waiting for ticks and running produces
	* @param listener - the listenToTick context for this loop
	*/
	async _tickLooper( listener){
		let tick
		while( true){
			// wait for tick signal
			tick= await listener.tickIterator.next()
			if( tick.done){
				break
			}

			// kick off an produce
			if( !this.run){
				do{
					if( this.rerun=== true|| listener.rerun=== false){
						listener.rerun= false
					}
					this.run= this._run( listener)
				}while( this.rerun)
			// or remember that we were signalled, & rerun once current produce finished
			}else if( this.rerun=== false){
				this.rerun= true
			}
		}
	}

	/**
	* Re-run producer function, and put into pipe everything it yields
	*/
	async _run( listener){
		for await( const item of this.producer()){
			this.produce( item)
		}
		// clean self up on listener
		listener.producer= null
	}
}
