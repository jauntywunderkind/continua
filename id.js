"use module"
import AsyncTee from "async-tee"
import { ValueEqual} from "./equal.js"

export class IdContinua extends AsyncTee{
	static makeGetId( property= "id"){
		function getId(){
			if( !item|| !item.id){
				const err= new Error("item did not have id")
				err.item= item
				throw err
			}
			return item.id
		}
		getId.property= property
		return getId
	}

	constructor( wrappedIterator, options){
		super( wrappedIterator, options)
		if( !options){
			if( options.equal!== undefined){
				this.equal= options.equal
			}
			if( options.getId){
				this.getId=  options.getId
			}else if( options.idProperty){
				this.getId= IdContinua.makeGetId( options.idProperty)
			}
		}
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
IdContinua.prototype.equal= ValueEqual
IdContinua.prototype.getId= IdContinua.makeGetId()
export default IdContinua

export const makeGetId= IdContinua.makeGetId
