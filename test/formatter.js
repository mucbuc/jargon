#!/usr/bin/env node

var assert = require( 'assert' )
  , Formatter = require( '../src/formatter.js' )
  , test = require( './base.js' );

assert( typeof Formatter === 'function' );

test( 'headingSpaces', function(emitter) {
  var formatter = new Formatter();

  emitter
    .expect( 'format', '\t \t \n ' )
    .expect( 'ere', 'hello' )
    .expect( 'end' );

  formatter.forward( 'ere', '\t \t \n hello', function(event, code) {
    console.log( event, code );
    emitter.emit( event, code ); 
  } );
} );

test( 'trailingSpaces', function(emitter) {
  var formatter = new Formatter();

  emitter
    .expect( 'ere', 'hello' )
    .expect( 'format', '\t \t \n ' )
    .expect( 'end' );
    
  formatter.forward( 'ere', 'hello\t \t', function(event, code) {
    emitter.emit( event, code ); 
  } );
});
/*
test( 'headingSpaces', function() {
	var formatter = new Formatter()
	  , emitter = new Expector();

	emitter
		.expect( 'format', '\t \t \n ' )
		.expect( 'ere', 'hello' )
		.expect( 'end' );

	formatter.forward( 'ere', '\t \t \n hello', function(event, code) {
		emitter.emit( event, code );	
	} );
} );

test( 'trailingSpaces', function() {
	var formatter = new Formatter()
	  , emitter = new Expector();

	emitter
		.expect( 'ere', 'hello' )
		.expect( 'format', '\t \t \n ' )
		.expect( 'end' );
		
	formatter.forward( 'ere', 'hello\t \t', function(event, code) {
		emitter.emit( event, code );	
	} );
});
*/