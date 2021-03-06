"use module"
import AsyncIterPersist from "async-iter-persist"

/**
* Pass through an async or sync iteration, deduplicating, by using a WeakSet to store items that we've seen.
*/
export class ReferenceUnique extends AsyncIterPersist{
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
