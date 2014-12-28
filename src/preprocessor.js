var assert = require( 'assert' )
  , regexMap = require( './regexmap' ).regexMap;

function Preprocessor( emitter ) {

  emitter.on( 'preprocess', function( response ) {
		var result = ''
		  , code = response.rhs;
		do {
			var chunk = code.search( '\n' ) + 1;
			chunk = Math.min( chunk, code.search( regexMap.commentMultiple ) ); 
			chunk = Math.min( chunk, code.search( regexMap.commentSingle ) ); 
			result += code.substr( 0, chunk );
			code = code.substr( chunk, code.length );
		}
		while (result[result.length - 2] === '\\' );
		response.consume( result.length );
	} );
}

module.exports = Preprocessor;
