#!/usr/bin/env node

var assert = require( 'chai' ).assert
  , events = require( 'events' )
  , Scoper = require( '../src/scoper' )
  , Preprocessor = require( '../src/preprocessor' )
  , fluke = require( 'flukejs' )
  , tapeWrapper = require( './tape-wrapper' )
  , setUp = tapeWrapper.setUp
  , tearDown = tapeWrapper.tearDown
  , test = tapeWrapper.test;

assert( typeof Preprocessor !== 'undefined' );

test( 'preprocessorSingleLine', t => {
  let emitter = setUp(t);

  emitter
    .expect( 'preprocess' )
    .expect( 'end' );
  split( '#define hello hello\nasdfaasdf\nbla', emitter);
  tearDown(emitter);
});

test( 'preprocessorAfterComment', t => {
  let emitter = setUp(t);

  emitter
    .expect( 'preprocess' )
    .expect( 'end' );
  split( '/*yo*/ #define BLA\n', emitter);
  tearDown(emitter);
});

test( 'preprocessorMultiple', t => {
  let emitter = setUp(t);

  emitter
    .expect( 'preprocess' )
    .repeat( 1 )
    .expect( 'end' );
  split( '#define A\n#define B\n', emitter);
  tearDown(emitter);
});

test( 'preprocessorMultiLine', t => {
  let emitter = setUp(t);

  emitter
    .expect( 'preprocess' )
    .expect( 'end' );
  split( '#define hello hello\\\nhello\nbla', emitter);
  tearDown(emitter);
});

function split( code, emitter ) {
  var preprocessor = new Preprocessor()
    , rules = { 'preprocess': '#' };

  fluke.splitAll( code, function( type, request ) {
      if (type === 'preprocess') {  
        preprocessor.preprocess( request, function() {});
      }
      emitter.emit(type, request);
    }
    , rules ); 
}

