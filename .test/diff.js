"use module"
import tape from "tape"

import Diff from "../producer.js"
import { incrementer} from "./fixture.js"

tape( "yields values", async function( t){
	
