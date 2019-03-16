import findSignal from "./find-signal.js"

let defaults

export async function *continua( factory, options){
	// find defaults
	let
	  optsTick= options&& options.tick,
	  optsComparator= options&& options.comparator
	if( !optsTick|| !optsComparator){
		if( !defaults){
			const module = await import( "./defaults.js")
			defaults= module.defaults
		}
		const d= defaults()
		optsTick= optsTick|| d.tick
		optsComparator= optsComparator|| d.comparator
	}

	// produce current state
	let state= await factory()
	// yield it all
	yield *state

	// start time ticking
	const ticker= optsTick( options)
	// for every tick
	for await( const tick of ticker){
		// re-fetch the state
		const newState= await factory()
		// in our new state,
		NEW: for( const newer of newState){
			// look for each element in our old state
			for( const existing of state){
				if( optsComparator( existing, newer)){
					// continue on if we find the element in the old state
					continue NEW
				}
			}
			// and yield the element if it's not in old state
			yield newer
		}
		// then capture our new state
		state= newState
	}
}
export const Continua = continua
export default continua
