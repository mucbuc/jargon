var assert = require( 'assert' )
  , Formatter = require( '../src/formatter.js' );

assert( typeof Formatter === 'function' );

console.log( typeof Formatter );

suite( 'formatter', function() {
	test( 'basic', function() {
		console.log( '****');
		//assert( true );
	} );
});