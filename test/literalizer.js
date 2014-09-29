#!/usr/bin/env node

var assert = require( 'assert' )
  , Literalizer = require( '../src/literalizer.js')
  , Expector = require( 'expector' ).Expector
  , fluke = require( 'flukejs' ); 

assert( typeof Literalizer === 'function' );

suite( 'literalizer', function() {

  var emitter;
  setup(function() {
    emitter = new Expector;
  });
  
  teardown(function() {
    emitter.check(); 
    delete emitter;
  }); 

  test( 'stringLiteral', function() {
    emitter.expectNot( 'declare' ); 
    emitter.expect( 'open literal' );
    split( '"struct hello;"' );
  });

  test( 'stringLiteralWithQutationMarks', function() {
    emitter.expectNot( 'declare' ); 
    emitter.expect( 'open literal' );
    split( '"struct he/"llo;"' );
  });

  function split( code ) {
    var literalizer = new Literalizer( emitter )
      , rules = { 'open literal': '([^//]"|^")' };

    fluke.splitAll( code, function( type, request ) {
        emitter.emit(type, request);
      }
      , rules ); 
  }
});
