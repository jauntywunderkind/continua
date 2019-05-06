"use module"
import AsyncTee from "async-tee"
import { ValueEqual} from "./equal.js"

/**
* Pass-through an async or sync iteration, de-duplicating by comparing each new item with all previous items via a deep-equal.
*/
export class ValueUnique extends AsyncTee{
	constructor( wrappedIterator, options){
		super( wrappedIterator, options)
		if( !options){
			if( options.equal!== undefined){
				this.equal= options.equal
			}
		}
	}
	filter( iter){
		if( !iter){
			return
		}
		for( let existing of this.state){
			if( this.equal( iter.value, existing)){
				return
			}
		}
		return iter
	}
}
ValueUnique.prototype.equal= ValueEqual
export default ValueUnique
