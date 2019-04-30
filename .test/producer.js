"use module"
import deferrant from "deferrant"
import tape from "tape"

import Producer from "../producer.js"
import { incrementer} from "./fixture.js"

tape( "yields values", async function( t){
	const
	  inc= incrementer( 6),
	  p= await Producer({ producer: inc})

	// create a bunch of "nexts" which must resolve in order
	const
	  p0= p.next(),
	  p1= p.next(),
	  p2= p.next()

	// feed first value
	inc.enqueue()
	const v0= await p0
	t.equal( v0.value, 0, "got 0")

	// feed next two values
	inc.enqueue()
	inc.enqueue()
	// make sure they resolve in order
	const
	  v1= await p1,
	  v1v= v1.value,
	  v2= await p2,
	  v2v= v2.value
	t.equal( v1v, 1, "got 1")
	t.equal( v2v, 2, "got 2")

	// have inner already have a value ready to pass
	inc.enqueue()
	// read out already available value value
	const
	  p3= p.next(),
	  v3= await p3,
	  v3v= v3.value
	t.equal( v3v, 3, "got 3")

	t.end()
})
