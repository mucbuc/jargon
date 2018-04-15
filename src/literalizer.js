const regexMap = require( './regexmap' ).regexMap
  , assert = require( 'assert' );
  
function Literalizer() {
	this.process = (req, cb) => {
		const match = req.rhs.match( regexMap.stringLiteral );
		assert( match.length >= 2, req.rhs ); 
		
		const value = match[1];
		req.consume( value.length + 1);
		cb( value );
	};
}

module.exports = Literalizer;