var assert = require( 'assert' )
  , regexMap = require( './regexmap' ).regexMap;

function Commenter( emitter ) {
  emitter.on( 'comment line', function( response ) {
    var comment = response.rhs.match( /.*\n/ );
  	response.consume( comment[0].lenght );
  } );

  emitter.on( 'comment block', function( response ) {
    var comment = response.rhs.match( /.*\*\// );
    response.consume( comment[0].lenght );
  } );
}

module.exports = Commenter;
