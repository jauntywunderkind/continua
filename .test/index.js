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
		data.shift()
		data.push({ [character]: number })
		// increment
		character= String.fromCharCode( character.charCodeAt(0))
		++number
		// return snapshot
		return oldData
	}
}

function tickFixture(){
	let d= deferrant()
	function tick(){
		d.resolve()
		d= deferrant()
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
	const r1= await continua.next()
	const r2= await continua.next()
	ticker.tick()
	const r3= await continua.next()
	ticker.tick()
	const r4= await continua.next()
	t.end()
})
