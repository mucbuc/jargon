#!/usr/bin/env node

var assert = require( 'chai' ).assert
  , events = require( 'events' )
  , Scoper = require( '../src/scoper' )
  , Preprocessor = require( '../src/preprocessor' )
  , fluke = require( 'flukejs' )
  , tapeWrapper = require( './tape-wrapper' )
  , setUp = tapeWrapper.setUp
  , tearDown = tapeWrapper.tearDown
  , test = tapeWrapper.test
  , splitjs = require( './../src/split' );

assert( typeof Preprocessor !== 'undefined' );

test( 'preprocessorSingleLine', t => {
  let emitter = 
    setUp(t)
    .expect( 'preprocess', '#define hello hello\n' );
  split( '#define hello hello\n', emitter);
  tearDown(emitter);
});

test( 'preprocessorMultiple', t => {
  let emitter = 
    setUp(t)
    .expect( 'preprocess' )
    .repeat( 1 );
  split( '#define A\n#define B\n', emitter);
  tearDown(emitter);
});

test( 'preprocessorMultiLine', t => {
  let emitter = 
    setUp(t)
    .expect( 'preprocess', '#define hello hello\\\nhello\n' );
  split( '#define hello hello\\\nhello\n', emitter);
  tearDown(emitter);
});

function split( code, emitter ) {
  splitjs(code, (type, value) => {
    emitter.emit( type, value );
  });
}