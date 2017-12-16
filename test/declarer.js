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
  let e = setUp(t)
    .expectNot( 'define type' )
    .expect( 'statement' )
    .expect( 'declare type' )
    .expect( 'end' );
  split( 'struct bla;', e );
  tearDown(e);
});

test( 'declareFunction', t => {
  let e = setUp(t)
    .expectNot( 'define function' )
    .expect( 'statement' )
    .expect( 'declare function', 'void foo()' )
    .expect( 'end' );
  split( 'void foo();', e );
  tearDown(e);
});

test( 'declareConstFunction', t => {
  let e = setUp(t)
    .expectNot( 'define function' )
    .expect( 'statement' )
    .expect( 'declare function', 'void foo() const' )
    .expect( 'end' );
  split( 'void foo() const;', e );
  tearDown(e);
});

test( 'declareNot1', t => {
  let e = setUp(t)
    .expectNot( 'declare function' )
    .expect( 'statement' )
    .expect( 'code line' )
    .expect( 'end' );
  split( 'bla bla;', e );
  tearDown(e);
});

test( 'declareNot2', t => {
  let e = setUp(t)
    .expectNot( 'declare function' )
    .expect( 'statement' )
    .expect( 'code line' )
    .expect( 'end' );
  
  split( 'bla += bla();', e );
  tearDown(e);
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

