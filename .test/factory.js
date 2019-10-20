"use module"
import AsyncIterExpect from "async-iter-expect"
import delay from "delay"
import tape from "tape"

import Factory from "continua/factory" // i haven't used package local scope before, only relative scope ..
import { Producer, Tick} from "./stub.js" // but also relative


tape( "build a factory which produces things", async function( t){
	t.plan( 1)
	const
	  producer= Producer(),
	  d= 3,
	  tick= Tick( d),
	  opts= {},
	  factory= new Factory( producer, tick, opts),
	  expect= new AsyncIterExpect( factory, [[ 1], [ 2, 2], [ 3, 3]])

	expect.then( function(){
		t.ok()
	}, function(){
		t.fail()
	})
	await delay( (d* 3)+ 50)
})









