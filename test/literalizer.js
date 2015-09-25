#!/usr/bin/env node

var assert = require( 'assert' )
  , Literalizer = require( '../src/literalizer.js')
  , fluke = require( 'flukejs' )
  , test = require( './base.js' );

assert( typeof Literalizer === 'function' );

test( 'stringLiteral', function(emitter) {
  emitter.expectNot( 'declare' ); 
  emitter.expect( 'open literal' );
  split( '"struct hello;"', emitter );
});

test( 'stringLiteralWithQutationMarks', function(emitter) {
  emitter.expectNot( 'declare' ); 
  emitter.expect( 'open literal' );
  split( '"struct he/"llo;"', emitter );
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

