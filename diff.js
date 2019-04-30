"use module"
import AsyncTee from "async-tee"
import { ValueEqual} from "./equal.js"

export class DiffContinua extends AsyncTee{
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
DiffContinua.prototype.equal= ValueEqual
export default DiffContinua
