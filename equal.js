"use module"
import ValueEqual from "fast-deep-equal"

export function ReferenceEqual( a, b){
	return a=== b
}

export {
  ValueEqual,
  ValueEqual as valueEqual,
  ValueEqual as value,
  ReferenceEqual as referenceEqual,
  ReferenceEqual as reference
}
