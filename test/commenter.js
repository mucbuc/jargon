#!/usr/bin/env node

var assert = require( 'chai' ).assert
  , Commenter = require( '../src/commenter' )
  , fluke = require( 'flukejs' )
  , tapeWrapper = require( './tape-wrapper' )
  , setUp = tapeWrapper.setUp
  , tearDown = tapeWrapper.tearDown
  , test = tapeWrapper.test;

assert( typeof Commenter === 'function' );

test.only( 'commenterSingleLineWithSpace', t => {
  let emitter = setUp(t);
  emitter
    .expect( 'comment line', 'hello' )
    .expect( 'end' );
  split( '  // hello\n', emitter );
  tearDown(emitter);
});

test( 'commenterSingleLine', t => {
  let emitter = setUp(t);
  emitter
    .expect( 'comment line' )
    .expect( 'end' );
  split( '// hello\n', emitter );
  tearDown(emitter);
});

test( 'commenterSingleLineWithoutNewLine', t => {
  let emitter = setUp(t);
  emitter
    .expect( 'comment line' )
    .expect( 'end' );
  split( '// hello', emitter );
  tearDown(emitter);
});

test( 'commenterTwoSingleLineWithoutNewLine', t => {
  let emitter = setUp(t);
  emitter
    .expect( 'comment line' )
    .repeat( 1 )
    .expect( 'end' );
  split( '// hello\n//hello', emitter );
  tearDown(emitter);
});

test( 'commentBlockWithCommentLine', t => {
  let emitter = setUp(t);
  emitter
    .expect( 'comment block', 'hello*/' )
    .expect( 'comment line' )
    .expect( 'end' );
  split( '/*hello*/a//b', emitter );
  tearDown(emitter);
});

test( 'commentBlock', t => {
  let emitter = setUp(t);
  emitter
    .expect( 'comment block' )
    .expect( 'end' );
  split( '/*hello*/', emitter );
  tearDown(emitter);
});

test( 'commentBlockWithNewLine', t => {
  let emitter = setUp(t);
  emitter
    .expect( 'comment block', '\n*/' )
    .expect( 'end' );
  split( '/*\n*/', emitter );
  tearDown(emitter);
});

test( 'commentBlockWithConent', t => {
  let emitter = setUp(t);
  emitter
    .expect( 'comment block', 'hello*/' )
    .expect( 'end' );
  split( '/*\nhello*/', emitter );
  tearDown(emitter);
});

function split( code, emitter ) {
  var commenter = new Commenter()
    , rules = {
        'comment line': '\\/\\/',
        'comment block': '\\/\\*',
    }; 

  fluke.splitAll( code, ( type, request ) => {
      if (type === 'comment line') {
        commenter.processLine( request, val => {
          emitter.emit( 'comment line', val );
        } );
      }
      else if (type === 'comment block') {
        commenter.processBlock( request, val => {
          emitter.emit( 'comment block', val );
        } );
      }
      else {
        emitter.emit( type, request );
      }
    }
    , rules ); 
}

