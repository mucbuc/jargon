#!/usr/bin/env node

var assert = require( 'assert' )
  , Formatter = require( '../src/formatter.js' )
  , tapeWrapper = require( './tape-wrapper' )
  , setUp = tapeWrapper.setUp
  , tearDown = tapeWrapper.tearDown
  , test = tapeWrapper.test;

assert( typeof Formatter === 'function' );

test( 'headingSpaces', function(t) {
    
  let emitter = setUp( t );

  var formatter = new Formatter();

  emitter
    .expect( 'format', '\t \t \n ' )
    .expect( 'ere', 'hello' );
    //.expect( 'end' );

  formatter.forward( 'ere', '\t \t \n hello', function(event, code) {
    emitter.emit( event, code ); 
  } );

  tearDown( emitter );
} );

test( 'trailingSpaces', function(t) {

  let emitter = setUp( t );
  var formatter = new Formatter();

  emitter
    .expect( 'ere', 'hello' )
    .expect( 'format', '\t \t' );
    //.expect( 'end' );
    
  formatter.forward( 'ere', 'hello\t \t', function(event, code) {
    emitter.emit( event, code ); 
  } );

  tearDown( emitter );
});
