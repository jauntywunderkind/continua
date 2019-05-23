"use module"
import Deferrant from "deferrant"

export function incrementer( max= Number.POSITIVE_INFINITY){
	async function *incrementer(){
		while( true){
			if( incrementer.queue.length){
				const val= incrementer.queue.shift()
				yield val
			}else if( incrementer.atEnd){
				return
			}else{
				incrementer.waiting= Deferrant()
				await incrementer.waiting
			}
		}
	}
	incrementer.next= 0 // next value to enqueue
	incrementer.queue= [] // values ready to be consumed
	incrementer.waiting= null // defer if we need to wait for an enqueue
	incrementer.enqueue= function( n= 1){
		while( !incrementer.atEnd&& n> 0){
			--n
			const next= incrementer.next++
			if( next>= max){
				console.log("enq-end")
				incrementer.atEnd= true
			}else{
				console.log("enq-val", next)
				incrementer.queue.push( next)
			}
		}
		if( incrementer.waiting){
			console.log("enq-wake")
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
