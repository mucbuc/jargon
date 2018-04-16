#!/usr/bin/env node

var assert = require( 'chai' ).assert
  , Commenter = require( '../src/commenter' )
  , fluke = require( 'flukejs' )
  , tapeWrapper = require( './tape-wrapper' )
  , setUp = tapeWrapper.setUp
  , tearDown = tapeWrapper.tearDown
  , test = tapeWrapper.test
  , splitjs = require( './../src/split' );

assert( typeof Commenter === 'function' );

test( 'commenterSingleLine', t => {
  let emitter = 
    setUp(t)
    .expect( 'comment', '// hello' );
  
  split( '// hello', emitter );
  tearDown(emitter);
});

test( 'commentBlockWithCommentLine', t => {
  let emitter = 
    setUp(t)
    .expect( 'comment', '/*hello*/' )
    .expect( 'comment', '//b' );
  split( '/*hello*/a//b', emitter );
  tearDown(emitter);
});

test( 'commentBlock', t => {
  let emitter = 
    setUp(t)
    .expect( 'comment', '/*hello*/' );
  split( '/*hello*/', emitter );
  tearDown(emitter);
});

test( 'commentBlockWithNewLine', t => {
  let emitter = 
    setUp(t)
    .expect( 'comment', '/*\n*/' );
  split( '/*\n*/', emitter );
  tearDown(emitter);
});

test( 'commentBlockWithConent', t => {
  let emitter = 
    setUp(t)
    .expect( 'comment', '/*\nhello*/' );
  split( '/*\nhello*/', emitter );
  tearDown(emitter);
});

function split( code, emitter ) {
  splitjs(code, (type, value) => {
    emitter.emit( type, value );
  });
}
