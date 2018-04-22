const assert = require( 'assert' )
  , regexMap = require( './regexmap' ).regexMap;

function Preprocessor(emitter, callback) {

  emitter.on( 'preprocess', req => {

/*
    // see if I can move this
    if (req.lhs.length && !req.lhs.match( /\S/ ))
    {
      callback( 'format', req.lhs );
      return;///?
    }
*/      
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
    if (typeof callback !== 'undefined') {
      callback( 'preprocess', '#' + result );
    }
  });

  return { 'preprocess': '#', };
}

module.exports = Preprocessor;
