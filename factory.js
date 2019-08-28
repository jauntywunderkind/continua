"use module"
import AsyncIterPipe from "async-iter-pipe/async-iter-pipe.js"

export class FactoryContinua extends AsyncIterPipe{
	listeners= []
	constructor( fn, tick, opts= {}){
		super( opts)
		this.fn= fn
		if( tick){
			this.listenToTick( tick)
		}
	}

	async listenToTick( ticker){
		// make listener state
		const state= {
			ticker,
			iterator: ticker[ Symbol.asyncIteration](),
			run: null,
			findIndex: ()=> this.listeners.indexOf( state)
		}
		// remember state
		this.listeners.push( state)

		let cursor
		while( true){
			cursor= await state.iterator.next()
			if( cursor.done){
				break
			}
			// no interlock atm!
			state.run= this._run( cursor.value)
		}
		return cursor.value
	}

	_run( value){
		for await( const item of this.fn( value)){
			this.produce( item)
		}
	}
}
