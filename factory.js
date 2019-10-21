"use module"
import AsyncIterPipe from "async-iter-pipe/async-iter-pipe.js"

export function Ticker( factory, ticker, opts){
	// save state
	this.ticker= ticker
	this.factory= factory

	// start work: create the ticker by asking for it's iterator
	this.iterator= ticker[ Symbol.asyncIterator]()
	// start looping the ticker
	this.loop= factory._tickLooper( this)

	return this
}
Ticker.prototype.tickersIndex= function(){
	return this.factory.tickers.indexOf( this)
}
Ticker.prototype.remove= function(){
	// clean up tick iterator
	let done
	if( this.iterator&& this.iterator.return){
		done= this.iterator.return()
	}

	// clean self up out of factory
	this.factory.tickers.remove( this)

	// return whence all cleaned up
	return done|| Promise.resolve()
}

export class FactoryContinua extends AsyncIterPipe{
	tickers= []
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
		const wrapped= new Ticker( this, ticker, opts)
		this.tickers.push( wrapped)
		return wrapped
	}

	/**
	* Keep waiting for ticks and running produces
	* @param ticker - the listenToTick context for this loop
	*/
	async _tickLooper( ticker){
		let tick
		while( true){
			console.log( "factory-tick")
			// wait for tick signal
			tick= await ticker.iterator.next()
			if( tick.done){
				console.log("factory-tick-done")
				break
			}

			console.log("factory-tick-producing")
			// kick off an produce
			if( !this.run){
				do{
					if( this.rerun=== true|| this.rerun=== false){
						this.rerun= false
					}
					this.run= this._run( ticker)
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
	async _run( ticker){
		console.log( "factory-_run")
		// iterate through items
		for await( const item of this.producer()){
			console.log( "factory-_run-item")
			// run parent's AsyncIterPipe#produce to take item
			this.produce( item)
		}
		// clean self up on ticker
		this.run= null
	}
}
export {
	FactoryContinua as default,
	FactoryContinua as factoryContinua,
	FactoryContinua as Factory,
	FactoryContinua as factory
}
