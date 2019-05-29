"use module"
import tape from "tape"

import ValueUnique from "../value.js"
import { a, b, c, fixture} from "./fixture.js"
import readAhead from "async-iter-read/ahead.js"

// running ReferenceUnique on the fixture should produce a, b, c
const expect= [ a, b, c]

tape( "yields values incrementally", async function( t){
	const
	  f= fixture(),
	  uniq= new ValueUnique( f)
	let i= 0;
	for await( let val of uniq){
		t.equal( val, expect[ i++])
	}
	t.equal( i, expect.length, "all expected values seen")
	t.end()
})

tape( ".next can be called multiple times without waiting for an answer", async function( t){
	const
	  f= fixture(),
	  uniq= new ValueUnique( f),
	  reads= await readAhead( uniq, 3)
	for( let i= 0; i< expect.length; ++i){
		t.equal( reads[ i], expect[ i])
	}
	t.end()
})
