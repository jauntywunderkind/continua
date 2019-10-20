"use module"
import AsyncIterInterval from "async-iter-interval"
import AsyncIterExpect from "async-iter-expect"
import delay from "delay"
import tape from "tape"

import Factory from "continua/factory" // i haven't used package local scope before, only relative scope ..
import { producer, tick} from "./stub.js" // but also relative


tape( "build a factory which produces things", async function( t){
	t.plan( 1)
	const
	  producer= Producer(),
	  delay= 3,
	  tick= Tick( delay),
	  opts= {},
	  factory= new Factory( producer, tick, {}),
	  expect= Expect( f, [[ 1], [ 2, 2], [ 3, 3]])

	expect.then( function(){
		t.ok()
	})
	await delay( (rate* 3)+ 2)
})









