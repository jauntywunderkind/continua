"use module"
export function DefaulterFactory( defaults= {}){
	return function defaulter( name, options){
		const primary= options&& options[ name]
		if( primary!== undefined){
			return primary
		}
		return defaults[ name]
	}
}
export default DefaulterFactory
