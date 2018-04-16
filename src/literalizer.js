const regexMap = require( './regexmap' ).regexMap
  , assert = require( 'assert' );
  
function Literalizer() {

	this.register = (emitter, callback) => {

	  emitter.on( 'open literal', req => {
		const match = req.rhs.match( regexMap.stringLiteral );
		assert( match.length >= 2, req.rhs ); 
		
		const value = match[1];
		req.consume( value.length + 1);
		callback( 'literal', value );
	  }); 
	
	  return { 'open literal': "\"" };
	};
}

module.exports = Literalizer;