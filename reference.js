"use module"
import AsyncTee from "async-tee"

/**
* Pass through an async or sync iteration, deduplicating, by using a WeakSet to store items that we've seen.
*/
export class ReferenceUnique extends AsyncTee{
	push( newItem){
		super.push( newItem)
		this.weakSet.add( newItem)
	}
	filter( iter){
		if( iter&& this.weakSet.has( iter.value)){
			return
		}
		return iter
	}
	clearState(){
		super.clearState()
		this.weakSet= new WeakSet()
	}
}
export default ReferenceUnique
