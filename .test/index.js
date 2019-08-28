"use module"
import deferrant from "deferrant"
import tape from "tape"

import Continua from ".."
import AsyncIterPipe from "async-iter-pipe"

function rollingDataFixture(){
	let
	  character= 'c',
	  number= 3,
	  data= [{ a: 1}, { b: 2}]
	return function roll(){
		// snapshot currenet data
		const oldData= data.slice( 0)
		// remove an element, add an element
		//data.shift()
		data.push({ [character]: number })
		// increment
		character= String.fromCharCode( character.charCodeAt(0)+ 1)
		++number
		// return snapshot
		return oldData
	}
}

tape( "produces a basic sequence", async function( t){
	t.plan( 4)
	const
	  roll= rollingDataFixture(),
	  ticker= new AsyncIterPipe(),
	  continua= new Continua( roll, { tick: ticker})
	// rolling data fixture starts with two elements immediately available
	const r1= await continua.next()
	t.deepEqual( r1.value, { a: 1})
	const r2= await continua.next()
	t.deepEqual( r2.value, { b: 2})

	// todo: validate that no elements are now available

	// emit a tick, which ought cause the data fixture to run
	ticker.produce()
	const r3= await continua.next()
	t.deepEqual( r3.value, { c: 3})
	ticker.produce()
	const r4= await continua.next()
	t.deepEqual( r4.value, { d: 4})
	t.end()
})
