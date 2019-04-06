"use module"
import deferrant from "deferrant"
import tape from "tape"

import Continua from "../continua.js"

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

function tickFixture(){
	let d= deferrant()
	function tick(){
		d= deferrant()
		process.nextTick(function(){
			d.resolve()
		})
	}
	async function *iterator(){
		while( true){
			await d
			yield
		}
	}
	return {
		tick,
		iterator
	}
}

tape( "produces a basic sequence", async function( t){
	t.plan( 4)
	const
	  roll= rollingDataFixture(),
	  ticker= tickFixture(),
	  continua= Continua( roll, { tick: ticker.iterator })
	// rolling data fixture starts with two elements immediately available
	const r1= await continua.next()
	t.deepEqual( r1.value, { a: 1})
	const r2= await continua.next()
	t.deepEqual( r2.value, { b: 2})

	// todo: validate that no elements are now available

	// emit a tick, which ought cause the data fixture to run
	ticker.tick()
	const r3= await continua.next()
	t.deepEqual( r3.value, { c: 3})
	ticker.tick()
	const r4= await continua.next()
	t.deepEqual( r4.value, { d: 4})
	t.end()
})
