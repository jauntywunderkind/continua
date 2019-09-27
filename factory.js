"use module"
import AsyncIterPipe from "async-iter-pipe/async-iter-pipe.js"

export function TickListener( ticker, factory, opts){
	// save state
	this.ticker= ticker
	this.factory= factory
	this.tickIterator: ticker[ Symbol.asyncIteration]()
	this.looper: null,
	this.producer: null,
	this.reproduce: opts&& opts.reproduce!== undefined? opts.reproduce|| false, // null will disable reproduce

	// start loop
	this.tickLooper= factory._tickLooper( this)
	return this
}
TickListener.prototype.listenersIndex= function(){
	return this.factory.listeners.indexOf( this)
}
TickListener.prototype.remove= function(){
	this.factory.listeners.remove( this)
}

export class FactoryContinua extends AsyncIterPipe{
	listeners= []
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
			if( !listener.producer){
				do{
					if( listener.reproduce=== true|| listener.reproduce=== false){
						listener.reproduce= false
					}
					listener.producer= this._producer( listener)
				}while( listener.reproduce)
			// or remember that we were signalled, & reproduce once current produce finished
			}else if( listener.reproduce=== false){
				listener.reproduce= true
			}
		}
	}

	/**
	* Re-run producer function, and put into pipe everything it yields
	*/
	async _producer( listener){
		for await( const item of this.producer()){
			this.produce( item)
		}
	}
}
