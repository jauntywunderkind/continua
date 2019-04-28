"use module"
import AsyncTee from "async-tee"

export class ReferenceContinua extends AsyncTee{
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
export default ReferenceContinua
