#!/usr/bin/env node

var assert = require( 'assert' )
  , Scoper = require( '../src/scoper' )
  , Declarer = require( '../src/declarer' )
  , fluke = require( 'flukejs' )
  , tapeWrapper = require( './tape-wrapper' )
  , setUp = tapeWrapper.setUp
  , tearDown = tapeWrapper.tearDown
  , test = tapeWrapper.test; 

assert( typeof Declarer === 'function' );

test( 'declareType', t => {
  let emitter = setUp(t);
  emitter
    .expectNot( 'define type' )
    .expect( 'statement' )
    .expect( 'declare type' )
    .expect( 'end' );
  split( 'struct bla;', emitter );
  tearDown(emitter);
});

test( 'declareFunction', t => {
  let emitter = setUp(t);
  emitter
    .expectNot( 'define function' )
    .expect( 'statement' )
    .expect( 'declare function', 'void foo()' )
    .expect( 'end' );
  split( 'void foo();', emitter );
  tearDown(emitter);
});

test( 'declareNot1', t => {
  let emitter = setUp(t);
  emitter
    .expectNot( 'declare function' )
    .expect( 'statement' )
    .expect( 'code line' )
    .expect( 'end' );
  split( 'bla bla;', emitter );
  tearDown(emitter);
});

test( 'declareNot2', t => {
  let emitter = setUp(t);
  emitter
    .expectNot( 'declare function' )
    .expect( 'statement' )
    .expect( 'code line' )
    .expect( 'end' );
  split( 'bla += bla();', emitter );
  tearDown(emitter);
});

function split( code, emitter ) {
  var rules = {
      'statement': ';',
      'open': '{'
    }
    , tokenizer = new Scoper( emitter, rules )
    , declarer = new Declarer();
    
  fluke.splitAll( code, ( type, req ) => {
      emitter.emit( type, req );
      if (type === 'statement') {
        process( req );
      }
      else if (type === 'end') {
        process( req );
      }

      function process( req ) { 
        declarer.process( req, ( type, val ) => {
          emitter.emit( type, val );
        });
      }
    }
    , rules ); 
}

