#!/usr/bin/env node

var assert = require( 'assert' )
  , Literalizer = require( '../src/literalizer.js')
  , fluke = require( 'flukejs' )
  , tapeWrapper = require( './tape-wrapper' )
  , setUpU = tapeWrapper.setUpU
  , tearDown = tapeWrapper.tearDown
  , test = tapeWrapper.test;

assert( typeof Literalizer === 'function' );

test( 'stringLiteral', function(t) {
  let emitter = setUpU(t);
  emitter.expectNot( 'declare' ); 
  emitter.expect( 'open literal' );
  split( '"struct hello;"', emitter );
  tearDown(emitter);
});

test( 'stringLiteralWithQutationMarks', function(t) {
  let emitter = setUpU(t);
  emitter.expectNot( 'declare' ); 
  emitter.expect( 'open literal' );
  split( '"struct he/"llo;"', emitter );
  tearDown(emitter);
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

