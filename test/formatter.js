#!/usr/bin/env node

var assert = require( 'assert' )
  , Formatter = require( '../src/formatter.js' )
  , tapeWrapper = require( './tape-wrapper' )
  , setUp = tapeWrapper.setUp
  , tearDown = tapeWrapper.tearDown
  , test = tapeWrapper.test;

assert( typeof Formatter === 'function' );

test( 'headingSpaces', t => {
    
  let emitter = setUp( t );

  var formatter = new Formatter();

  emitter
    .expect( 'format', '\t \t \n ' )
    .expect( 'ere', 'hello' );

  formatter.forward( 'ere', '\t \t \n hello', (event, code) => {
    emitter.emit( event, code ); 
  } );

  tearDown( emitter );
} );

test( 'trailingSpaces', t => {

  let emitter = setUp( t );
  var formatter = new Formatter();

  emitter
    .expect( 'ere', 'hello' )
    .expect( 'format', '\t \t' );
    
  formatter.forward( 'ere', 'hello\t \t', (event, code) => {
    emitter.emit( event, code ); 
  } );

  tearDown( emitter );
});
