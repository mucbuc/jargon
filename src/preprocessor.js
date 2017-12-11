var assert = require( 'assert' )
  , regexMap = require( './regexmap' ).regexMap;

function Preprocessor() {

  this.preprocess = ( req, cb ) => {
    let result = ''
      , code = req.rhs;
    do {
      let chunk = code.length
        , newLine = code.search( '\n' ) 
        , commentMultiple = code.search( regexMap.commentMultiple )
        , commentSingle = code.search( regexMap.commentSingle );

      if (newLine != -1) {
        chunk = newLine + 1;
      }
      if (commentMultiple != -1) {
        chunk = Math.min( chunk, commentMultiple );
      }
      if (commentSingle != -1) {
        chunk = Math.min( chunk, commentSingle );
      }
      result += code.substr( 0, chunk );
      code = code.substr( chunk, code.length );
    }
    while (result[result.length - 2] === '\\' );
    
    req.consume( result.length );
    if (typeof cb !== 'undefined') {
      cb( result );
    }
  };
}

module.exports = Preprocessor;
