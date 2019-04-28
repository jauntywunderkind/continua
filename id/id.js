"use module"
import AsyncTee from "async-tee"
import equal from "fast-deep-equal"

export class IdContinua extends AsyncTee{
	static ReferenceDiff( a, b){
		return a=== b
	}
	// done on constructor since this is a very new language feature
	//static ValueDiff= equal

	constructor( wrappedIterator, options){
		super( wrappedIterator, options)
		if( !options){
			if( options.equal!== undefined){
				this.equal= options.equal
			}
		}
	}
	getId( item){
		if( !item|| !item.id){
			const err= new Error("item did not have id")
			err.item= item
			throw err
		}
		return item.id
	}
	filter( iter){
		if( !iter){
			return
		}
		const
		  id= this.getId( iter.value),
		  existing= this.ids[ id]
		if( this.equal!== undefined&& this.equal( iter, existing)){
			return
		}
		return iter
	}
	push( item){
		super.push( item)
		const id= this.getId( item)
		this.ids[ id]= item
	}
	clearState(){
		super.clearState()
		this.ids= {}
	}
}
IdContinua.ValueDiff= equal
IdContinua.prototype.equal= equal
export default IdContinua

export const
  ReferenceDiff= IdContinua.ReferenceDiff,
  ValueDiff= IdContinua.Valuediff
