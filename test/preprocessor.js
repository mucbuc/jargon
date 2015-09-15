#!/usr/bin/env node

var assert = require( 'chai' ).assert
  , events = require( 'events' )
  , Scoper = require( '../src/scoper' )
  , Preprocessor = require( '../src/preprocessor' )
  , fluke = require( 'flukejs' )
  , test = require( './seqbase.js' );

assert( typeof Preprocessor !== 'undefined' );

test( 'preprocessorSingleLine', function(emitter) {
  emitter
    .expect( 'preprocess' )
    .expect( 'end' );
  split( '#define hello hello\nasdfaasdf\nbla', emitter);
});

test( 'preprocessorAfterComment', function(emitter) {
  emitter
    .expect( 'preprocess' )
    .expect( 'end' );
  split( '/*yo*/ #define BLA\n', emitter);
});

test( 'preprocessorMultiple', function(emitter) {
  emitter
    .expect( 'preprocess' )
    .repeat( 1 )
    .expect( 'end' );
  split( '#define A\n#define B\n', emitter);
});

test( 'preprocessorMultiLine', function(emitter) {
  emitter
    .expect( 'preprocess' )
    .expect( 'end' );
  split( '#define hello hello\\\nhello\nbla', emitter);
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

