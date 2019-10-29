"use module"
import AsyncIterExpect from "async-iter-expect"
import Delay from "delay"
import tape from "tape"

import Factory from "continua/factory" // i haven't used package local scope before, only relative scope ..
import { Producer, Tick, DELAY} from "./stub.js" // but also relative

tape( "build a factory which produces things", async function( t){
	t.plan( 1)
	const
	  producer= Producer(),
	  tick= Tick( DELAY),
	  opts= {},
	  factory= new Factory( producer, tick, opts),
	  //expect= new AsyncIterExpect( factory, [[ 1], [ 2, 2], [ 3, 3, 3]])
	  expect= new AsyncIterExpect( factory, [ 1, 2, 2, 3, 3, 3])

	expect.then( function(){
		t.ok()
	}, function(){
		t.fail()
	})
	await Delay(( DELAY* 3) + 5 )
	tick.clearInterval()
})









