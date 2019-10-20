"use module"
import tape from "tape"
import Factory from "continua/factory" // i haven't used package local scope before, only relative scope ..

tape( "build a factory which produces things", function( t){
	function generator( n= generator.n){
		const arr= new Array( generator.n)
		arr.fill( generator.n)
		return arr
	}
	generator.n= 1

	
})









