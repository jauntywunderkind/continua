"use module"
import Deferrant from "deferrant"

export function incrementer( max= Number.POSITIVE_INFINITY){
	async function *incrementer(){
		while( true){
			if( incrementer.queue.length){
				const val= incrementer.shift()
				yield val
			}else if( incrementer.atEnd){
				return
			}else{
				incrementer.waiting= Deferrant()
				await incremeneter.waiting
			}
		}
	}
	incrementer.next= 0 // next value to enqueue
	incrementer.queue= [] // values ready to be consumed
	incrementer.waiting= null // defer if we need to wait for an enqueue
	incrementer.enqueue= function( n= 1){
		while( !incrementer.atEnd&& n>= 0){
			const next= incrementer.next++
			if( next>= max){
				incrementer.atEnd= true
			}else{
				incrementer.queue.push( next)
			}
		}
		if( incrementer.waiting){
			incrementer.waiting.resolve()
			incrementer.waiting= undefined
		}
	}
	incrementer.atEnd= false
	incrementer.end= function(){
		incrementer.atEnd= true
	}
	return incrementer
}
