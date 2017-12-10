#!/usr/bin/env node

var assert = require( 'assert' )
  , Literalizer = require( '../src/literalizer.js')
  , fluke = require( 'flukejs' )
  , tapeWrapper = require( './tape-wrapper' )
  , Expector = require( 'expector' ).Expector
  , test = tapeWrapper.test;

assert( typeof Literalizer === 'function' );

test( 'stringLiteral', function(t) {
  let emitter = new Expector(t);
  emitter.expectNot( 'declare' ); 
  emitter.expect( 'open literal' );
  split( '"struct hello;"', emitter );
  emitter.check();
});

test( 'stringLiteralWithQutationMarks', function(t) {
  let emitter = new Expector(t);
  emitter.expectNot( 'declare' ); 
  emitter.expect( 'open literal' );
  split( '"struct he/"llo;"', emitter );
  emitter.check();
});

function split( code, emitter ) {
  var literalizer = new Literalizer()
    , rules = { 'open literal': '([^//]"|^")' };

  fluke.splitAll( code, function( type, request ) {
      console.log( 'emit', type, request );
      emitter.emit(type, request);
    }
    , rules ); 
}

