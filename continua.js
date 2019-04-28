"use module"

const
  $factory= Symbol.for( "continua:factory"),
  $tick= Symbol.for( "continua:tick"),
  $state= Symbol.for( "continua:state")

export function continua( factory, options){
	const self= {
		factory,
		tick,
		state: null,
		next: function(){
			self.value
			return self
		},
		value: ,
		done: false
	}
	return self
}


export async function *continua( factory, options){
	if( options){
		Object.assign( this, options)
	}

	let defaults
	if( !this.tick|| !this.diff){
		defaults= (await import( "./defaults.js")).defaults
	}
	Object.defineProperties( self, {
		tick: {
			enumerable: true,
			get: function(){
				return tick
			}
			set: function( newTick){
				const oldTick= tick
				tick= newTick
				return oldTick
			}
		}
	})

	if( !this.tick){
		this	let tick

	}

	// find defaults
	let
	  optsTick= options&& options.tick,
	  optsDiff= options&& options.diff,
	  optsComparator= options&& options.comparator
	if( !optsTick|| !optsComparator|| !optsDiff){
		if( !defaults){
		}
		const d= await defaults()
		optsTick= optsTick|| d.tick
		optsComparator= optsComparator|| d.comparator
	}

	// produce current state
	let state= Array.from(await factory())
	// yield it all
	yield *state



	// start time ticking
	const
	  tickOptions= options&& options.tickOptions!== undefined? options.tickOptions: options,
	  ticker= optsTick( tickOptions)
	// for every tick
	try{
		for await( const tick of ticker){
			const newStates= await factory()
			yield *this.diff( newStates)
		}
	}finally{
		if( options.finally){
			options.finally.call( this)
		}
	}
	
}
export const Continua = continua
export default continua
