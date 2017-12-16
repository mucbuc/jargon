#!/usr/bin/env node

var assert = require( 'assert' )
  , Literalizer = require( '../src/literalizer.js')
  , fluke = require( 'flukejs' )
  , tapeWrapper = require( './tape-wrapper' )
  , setUpU = tapeWrapper.setUpU
  , tearDown = tapeWrapper.tearDown
  , test = tapeWrapper.test;

assert( typeof Literalizer === 'function' );

test( 'stringLiteral', t => {
  let e = setUpU(t)
  .expectNot( 'declare' ) 
  .expect( 'open literal' );

  split( '"struct hello;"', e );
  tearDown(e);
});

test( 'stringLiteralWithQutationMarks', t => {
  let e = setUpU(t)
  .expectNot( 'declare' )
  .expect( 'open literal' );
  
  split( '"struct he/"llo;"', e );
  tearDown(e);
});

function split( code, emitter ) {
  var literalizer = new Literalizer()
    , rules = { 'open literal': '([^//]"|^")' };

  fluke.splitAll( code, function( type, request ) {
      emitter.emit(type, request);
    }
    , rules ); 
}

