"use module"
import AsyncIterPipe from "async-iter-pipe/async-iter-pipe.js"

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

	async listenToTick( res, rej, self, ticker){

		// make listener state
		const state= {
			factory: this,
			ticker,
			iterator: ticker[ Symbol.asyncIteration]? ticker[ Symbol.asyncIteration](): ticker[ Symbol.iteration]()
			run: null,
			findIndex: ()=> this.listeners.indexOf( state)
		}
		// remember state
		this.listeners.push( self)

		// start run
		state.processor= _run( state)
		// return state
		return state
	}

	async _run( state){
		let cursor
		while( true){
			cursor= await self.iterator.next()
			if( cursor.done){
				break
			}
			// run if not running
			if( !state.run){
				do{
					if( state.rerun=== true|| state.rerun=== false){
						state.rerun= false
					}
					state.run= this._run( state)
				}while( state.rerun)
			}else if(state.rerun=== false){
				// re-run once run
				state.rerun= true
			}
		}
		return cursor.value
	}
	async _run( state){
		for await( const item of this.producer( value)){
			state.factory.produce( item)
		}
	}
}
