import findSignal from "./find-signal.js"

let defaults

export async function *continua( factory, options){
	const
	  optsTick= options&& options.tick,
	  optsComparator= options&& options.comparator
	if( !optsTick|| !optsComparator){
		if( !defaults){
			const module= await import("./default.js")
			defaults= await module.default()
		}
		optsTick= optsTick|| defaults.tick
		optsComparator= optsComparator|| defaults.comparator
	}

	// produce current state
	let state= await factory()
	yield *state

	// keep ticking through time
	const ticker= optsTick( options)
	for await( const tick of ticker){
		const newState= await factory()
		NEW: for( const newer of newState){
			for( const existing of state){
				if( optsComparator( existing, newer)){
					// we've seen this element
					continue NEW
				}
			}
			// element is not in current state, emit it
			yield newer
		}
		state= newState
	}
}
