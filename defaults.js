export let
  tick,
  comparator

export function setTick( newTick){
	const old= tick
	tick= newTick
	_defaults= undefined
	return old
}

export function setComparator( newComparator){
	const old= comparator
	comparator= newComparator
	_defaults= undefined
	return old
}

function defaultFromModule(module, prop= "default"){
	return async function defaultProvider(){
		const imported= await import(module)
		return imported[ prop]
	}
}

export const
  defaultTick= defaultFromModule("set-time-can/set-inter-can.js"),
  defaultComparator= defaultFromModule( "fast-deep-equal")

let _defaults

export async function defaults(){
	if( !_defaults){
		if( !tick){
			tick= await defaultTick()
		}
		if( !comparator){
			comparator= await defaultComparator()
		}
		_defaults= {
			tick,
			comparator
		}
	}
	return _defaults
}
export default defaults
