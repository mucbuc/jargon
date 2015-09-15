#!/usr/bin/env node

var assert = require( 'assert' )
  , Scoper = require( '../src/scoper' )
  , Declarer = require( '../src/declarer' )
  , fluke = require( 'flukejs' )
  , test = require( './seqbase.js' ); 

assert( typeof Declarer === 'function' );

test( 'declareType', function(emitter){
  emitter
    .expectNot( 'define type' )
    .expect( 'statement' )
    .expect( 'declare type' )
    .expect( 'end' );
  split( 'struct bla;', emitter );
});

test( 'declareFunction', function(emitter){
  emitter
    .expectNot( 'define function' )
    .expect( 'statement' )
    .expect( 'declare function', 'void foo()' )
    .expect( 'end' );
  split( 'void foo();', emitter );
});

test( 'declareNot1', function(emitter){
  emitter
    .expectNot( 'declare function' )
    .expect( 'statement' )
    .expect( 'code line' )
    .expect( 'end' );
  split( 'bla bla;', emitter );
});

test( 'declareNot2', function(emitter){
  emitter
    .expectNot( 'declare function' )
    .expect( 'statement' )
    .expect( 'code line' )
    .expect( 'end' );
  split( 'bla += bla();', emitter );
});

function split( code, emitter ) {
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

