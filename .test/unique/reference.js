"use module"
import tape from "tape"

import ReferenceUnique from "../../unique/reference.js"

import { fixture, a, b, c, readAhead, readAll} from "./fixture.js"


tape( "reference deduplicate", async function( t){
	const
	  f= fixture(),
	  refUnique= new ReferenceUnique( f, { notify: true})

	const
	  preFork= readAhead( refUnique.tee(), 8),
	  read= readAll( refUnique),
	  postFork= readAhead( refUnique.tee(), 8),
	  doneRead= await read

	const
	  postReadFork= readAhead( refUnique.tee(), 8),
	  donePreFork= await preFork,
	  donePostFork= await postFork,
	  donePostReadFork= await postReadFork

	console.log({ doneRead, donePreFork, donePostFork, donePostReadFork})
	t.end()
})
	
