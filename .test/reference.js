"use module"
import tape from "tape"

import ReferenceUnique from "../../unique/reference.js"

import { fixture, a, b, c, readAhead, readAll} from "./fixture.js"


tape( "reference deduplicate", async function( t){
	const
	  f= fixture(),
	  refUnique= new ReferenceUnique( f, { notify: true})

	const
	  // start an iteration to read all data, ahead of our main read
	  preForkAhead= readAhead( refUnique.tee(), 8),
	  preForkAll= readAll( refUnique.tee()),
	  // read all elements in the main
	  read= readAll( refUnique),
	  // start an iteration after the fact
	  postForkAhead= readAhead( refUnique.tee(), 8),
	  postForkAll= readAll( refUnique.tee())

	const
	  // wait for main read to finish
	  doneRead= await read,
	  // start another read
	  postReadForkAhead= readAhead( refUnique.tee(), 8),
	  postReadForkAll= readAll( refUnique.tee()),
	  // wait for iterations to finish
	  donePreForkAhead= await preForkAhead,
	  donePreForkAll= await preForkAll,
	  donePostForkAhead= await postForkAhead,
	  donePostForkAll= await postForkAll,
	  donePostReadForkAhead= await postReadForkAhead,
	  donePostReadForkAll= await postReadForkAll

	console.log({ doneRead, donePreForkAhead, donePreForkAll, donePostForkAhead, donePostForkAll, donePostReadForkAhead, donePostForkAll})
	t.end()
})
	
