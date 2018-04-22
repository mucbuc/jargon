const assert = require( 'assert' )
  , regexMap = require( './regexmap' ).regexMap;

function Commenter(emitter, callback) {
  
  emitter.on( 'comment line', req => {
    const comment = req.rhs.match( /.*/ );
    assert( comment ); 
    req.consume( comment[0].length );
    callback( 'comment', '\/\/' + comment[0] );
  }); 

  emitter.on( 'comment block', req => {
    let pos = req.rhs.search( /\*\// );
    assert (pos != -1);
    let comment = req.rhs.substr( 0, pos + req.token.length );
    req.consume( comment.length );
    callback( 'comment', '/*' + comment );
  });

  return {
    'comment line': '\\/\\/',
    'comment block': '\\/\\*'
  };
}

module.exports = Commenter;
