"use module"
import AsyncIterPersist from "async-iter-persist"
import { ValueEqual} from "./equal.js"

/**
* Pass through a async or sync iteration, de-duplicating by finding an id for each item, and
* passing through only new items or items that change (via deep-equal).
*
* This is an optimization of the "value" strategy, for cases where elements
* can synthesize a unique-ifying id.
*/
export class IdUnique extends AsyncIterPersist{
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
				this.getId= IdUnique.makeGetId( options.idProperty)
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
IdUnique.prototype.equal= ValueEqual
IdUnique.prototype.getId= IdUnique.makeGetId()
export default IdUnique

export const makeGetId= IdUnique.makeGetId
