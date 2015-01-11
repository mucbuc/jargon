#!/usr/bin/env node

var assert = require( 'chai' ).assert
  , Commenter = require( '../src/commenter' )
  , Expector = require( 'expector' ).SeqExpector
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
    emitter
      .expect( 'comment line' )
      .expect( 'end' );
    split( '// hello\n' );
  });

  test( 'commenterSingleLineWithoutNewLine', function(){
    emitter
      .expect( 'comment line' )
      .expect( 'end' );
    split( '// hello' );
  });

  test( 'commenterTwoSingleLineWithoutNewLine', function(){
    emitter
      .expect( 'comment line' )
      .repeat( 1 )
      .expect( 'end' );
    split( '// hello\n//hello' );
  });

  test( 'commentBlock', function() {
    emitter
      .expect( 'comment block' )
      .expect( 'end' );
    split( '/*hello*/' );
  }); 

  function split( code ) {
    var commenter = new Commenter()
      , rules = {
          'comment line': '\\/\\/',
          'comment block': '\\/\\*',
      }; 

    fluke.splitAll( code, function( type, request ) {
        if (type === 'comment line') {
          commenter.processLine( request, function(val) {
            emitter.emit( 'comment line', val );
          } );
        }
        else if (type === 'comment block') {
          commenter.processBlock( request, function(val) {
            emitter.emit( 'comment block', val );
          } );
        }
        else {
          emitter.emit( type, request );
        }
      }
      , rules ); 
  }

});

