#!/usr/bin/env node

var assert = require( 'chai' ).assert
  , events = require( 'events' )
  , Scoper = require( '../src/scoper' )
  , Preprocessor = require( '../src/preprocessor' )
  , Expector = require( 'expector' ).Expector
  , fluke = require( 'flukejs' );

assert( typeof Preprocessor !== 'undefined' );

suite( 'preprocessor', function() {

  var emitter;
  setup(function() {
    emitter = new Expector;
  });
  
  teardown(function() {
    emitter.check(); 
    delete emitter;
  }); 

  test( 'preprocessorSingleLine', function() {
    emitter.expect( 'preprocess' );
    //emitter.expect( 'consume', '#define hello hello\n' );
    split( '#define hello hello\nasdfaasdf\nbla' );
  });

  test( 'preprocessorAfterComment', function() {
    emitter.expect( 'preprocess' ); // consume =>, '#define BLA\n' );
    split( '/*yo*/ #define BLA\n');
  });
  
  test( 'preprocessorMultiple', function() {
    emitter.expect( 'preprocess' ); // consume =>, '#define A\n' );
    emitter.expect( 'preprocess' ); // consume =>, '#define B\n' );
    split( '#define A\n#define B\n' );
  });

  test( 'preprocessorMultiLine', function() {
    emitter.expect( 'preprocess' ); // consume =>, '#define hello hello\\\nhello\n' );
    split( '#define hello hello\\\nhello\nbla' );
  });

  function split( code ) {
    var commenter = new Preprocessor( emitter )
      , rules = { 'preprocess': '#' };

    fluke.splitAll( code, function( type, request ) {
        emitter.emit(type, request);
      }
      , rules ); 
  }
}); 


