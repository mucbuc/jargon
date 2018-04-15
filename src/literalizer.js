const regexMap = require( './regexmap' ).regexMap
  , assert = require( 'assert' );
  
function Literalizer() {

	this.register = (emitter) => {

	  emitter.on( 'open literal', request => {
	    literalizer.process( request, (literal) => {
	      callback( 'literal', literal );
	    });
	  }); 
	
	  return { 'open literal': regexMap.openLiteral };
	};

	this.process = (req, cb) => {
		const match = req.rhs.match( regexMap.stringLiteral );
		assert( match.length >= 2, req.rhs ); 
		
		const value = match[1];
		req.consume( value.length + 1);
		cb( value );
	};
}

module.exports = Literalizer;