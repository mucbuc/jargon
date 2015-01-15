var assert = require( 'assert' )
  , regexMap = require( './regexmap' ).regexMap;

function Commenter() {
  
  this.processLine = function(req, cb) {
    var comment = req.rhs.match( /.*/ );
    req.consume( comment[0].length + 1 );
    cb( comment[0] ); 
  };

  this.processBlock = function(req, cb) {
    var comment = req.rhs.match( /.*\*\// );
    req.consume( comment[0].length + 1 );
    cb( comment[0] );    
  };
}

module.exports = Commenter;
