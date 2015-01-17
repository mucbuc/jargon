var assert = require( 'assert' )
  , regexMap = require( './regexmap' ).regexMap;

function Commenter() {
  
  this.processLine = function(req, cb) {
    var comment = req.rhs.match( /.*/ );
    req.consume( comment[0].length );
    cb( comment[0] ); 
  };

  this.processBlock = function(req, cb) {
    var comment = req.rhs.match( /.*\*\// );
    //console.log( req, comment );
    req.consume( comment[0].length );
    cb( comment[0] );    
  };
}

module.exports = Commenter;
