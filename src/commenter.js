const assert = require( 'assert' )
  , regexMap = require( './regexmap' ).regexMap;

function Commenter() {
  
  this.processLine = (req, cb) => {
    const comment = req.rhs.match( /.*/ );
    
    assert( comment ); 
    req.consume( comment[0].length );
    cb( comment[0] ); 
  };

  this.processBlock = (req, cb) => {
    let pos = req.rhs.search( /\*\// );

    assert (pos != -1);
    
    let comment = req.rhs.substr( 0, pos + req.token.length );
    req.consume( comment.length );
    cb( comment );
  };
}

module.exports = Commenter;
