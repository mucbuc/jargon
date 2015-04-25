#!/usr/bin/env node

var assert = require( 'assert' )
  , Scoper = require( '../src/scoper' )
  , Declarer = require( '../src/declarer' )
  , Expector = require( 'expector' ).SeqExpector
  , fluke = require( 'flukejs' ); 

assert( typeof Declarer === 'function' );

suite( 'declarer', function() {

  var emitter;
  setup(function() {
    emitter = new Expector;
  });

  teardown(function() {
    emitter.check(); 
    delete emitter;
  }); 

  test( 'declareType', function(){
    emitter
      .expectNot( 'define type' )
      .expect( 'statement' )
      .expect( 'declare type' )
      .expect( 'end' );
    split( 'struct bla;' );
  });

  test( 'declareFunction', function(){
    emitter
      .expectNot( 'define function' )
      .expect( 'statement' )
      .expect( 'declare function', 'void foo()' )
      .expect( 'end' );
    split( 'void foo();' );
  });

  test( 'declareNot1', function(){
    emitter
      .expectNot( 'declare function' )
      .expect( 'statement' )
      .expect( 'code line' )
      .expect( 'end' );
    split( 'bla bla;' );
  });
  
  test( 'declareNot2', function(){
    emitter
      .expectNot( 'declare function' )
      .expect( 'statement' )
      .expect( 'code line' )
      .expect( 'end' );
    split( 'bla += bla();' );
  });

  function split( code ) {
    var rules = {
        'statement': ';',
        'open': '{'
      }
      , tokenizer = new Scoper( emitter, rules )
      , declarer = new Declarer();
      
    fluke.splitAll( code, function( type, req ) {
        emitter.emit( type, req );
        if (type === 'statement') {
          process( req );
        }
        else if (type === 'end') {
          process( req );
        }

        function process( req ) { 
          declarer.process( req, function( type, val ) {
            emitter.emit( type, val );
          });
        }
      }
      , rules ); 
    }
});

