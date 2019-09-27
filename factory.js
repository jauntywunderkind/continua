"use module"
import AsyncIterPipe from "async-iter-pipe/async-iter-pipe.js"

function listenersIndex(){
	return this.listeners.indexOf( this)
}

function remove(){
	this.listeners.remove( this)
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

		// make listener
		const listener= {
			// listener
			factory: this,
			ticker,
			iterator: ticker[ Symbol.asyncIteration]? ticker[ Symbol.asyncIteration](): ticker[ Symbol.iteration]()
			looper: null,
			producer: null,
			reproduce: opts&& opts.reproduce!== undefined? opts.reproduce|| false, // null will disable reproduce
			listenersIndex,
			remove
		}
		// remember listener
		this.listeners.push( listener)

		// start run
		listener.looper= this._looper( listener)
		// return listener
		return listener
	}

	/**
	* Keep waiting for ticks and running produces
	* @param listener - the listenToTick context for this loop
	*/
	async _looper( listener){
		let tick
		while( true){
			// wait for tick signal
			tick= await listener.ticker.next()
			if( tick.done){
				break
			}

			// kick off an produce
			if( !listener.producer){
				do{
					if( listener.reproduce=== true|| listener.reproduce=== false){
						listener.reproduce= false
					}
					listener.producer= this._producer.call( listener.factory, listener)
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
