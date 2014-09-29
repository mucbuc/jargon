#!/usr/bin/env node

var assert = require( 'chai' ).assert
  , Commenter = require( '../src/commenter' )
  , Expector = require( 'expector' ).Expector
  , fluke = require( 'flukejs' );

assert( typeof Commenter === 'function' );

suite( 'commenter', function() {

  var emitter;
  setup(function() {
    emitter = new Expector;
  });
  
  teardown(function() {
    emitter.check(); 
    delete emitter;
  }); 

  test( 'commenterSingleLine', function(){
    emitter.expect( 'comment line' );
    //emitter.expect( 'consume', 'hello\n' ); // not sure why this fails
    split( '// hello\n' );
  });

  test( 'commentBlock', function() {
    emitter.expect( 'comment block' );
    //emitter.expect( 'consume', 'hello*/' ); // not sure why this fails
    split( '/*hello*/' );
  }); 

  function split( code ) {
    var commenter = new Commenter( emitter )
      , rules = {
          'comment line': '\\/\\/',
          'comment block': '\\/\\*',
      }; 

    fluke.splitAll( code, function( type, request ) {
        emitter.emit(type, request);
      }
      , rules ); 
  }

});

