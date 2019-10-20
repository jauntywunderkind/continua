"use module"
import delay from "delay"
import tape from "tape"

import Factory from "continua/factory" // i haven't used package local scope before, only relative scope ..
import { producer, tick} from "./stub.js" // but also relative

import AsyncIterInterval from "async-iter-interval"

tape( "build a factory which produces things", async function( t){
	t.plan( 3)
	const
	  producer= Producer(),
	  tick= Tick(),
	  opts= {},
	  f= new Factory( producer, tick, {})
	await delay( 6) // 
	
})









