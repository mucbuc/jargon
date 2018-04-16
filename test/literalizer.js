#!/usr/bin/env node

var assert = require( 'assert' )
  , tapeWrapper = require( './tape-wrapper' )
  , setUpU = tapeWrapper.setUpU
  , tearDown = tapeWrapper.tearDown
  , test = tapeWrapper.test
  , splitjs = require( './../src/split' );

assert( typeof splitjs === 'function' );

test( 'stringLiteral', t => {
  let e = setUpU(t)
  .expectNot( 'declare' ) 
  .expect( 'literal', 'struct hello;' );

  split( '"struct hello;"', e );
  tearDown(e);
});

test( 'stringLiteralWithQutationMarks', t => {
  let e = setUpU(t)
  .expectNot( 'declare' )
  .expect( 'literal', 'struct hel/"lo;' );
  
  split( '"struct hel/"lo;"', e );
  tearDown(e);
});

function split( code, emitter ) {
  splitjs(code, (type, value) => {
    emitter.emit( type, value );
  });
}
