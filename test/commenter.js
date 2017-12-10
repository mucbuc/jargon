#!/usr/bin/env node

var assert = require( 'chai' ).assert
  , Commenter = require( '../src/commenter' )
  , fluke = require( 'flukejs' )
  , tapeWrapper = require( './tape-wrapper' )
  , setUp = tapeWrapper.setUp
  , tearDown = tapeWrapper.tearDown
  , test = tapeWrapper.test;

assert( typeof Commenter === 'function' );

test( 'commenterSingleLine', function(t){
  let emitter = setUp(t);
  emitter
    .expect( 'comment line' )
    .expect( 'end' );
  split( '// hello\n', emitter );
  tearDown(emitter);
});

test( 'commenterSingleLineWithoutNewLine', function(t){
  let emitter = setUp(t);
  emitter
    .expect( 'comment line' )
    .expect( 'end' );
  split( '// hello', emitter );
  tearDown(emitter);
});

test( 'commenterTwoSingleLineWithoutNewLine', function(t){
  let emitter = setUp(t);
  emitter
    .expect( 'comment line' )
    .repeat( 1 )
    .expect( 'end' );
  split( '// hello\n//hello', emitter );
  tearDown(emitter);
});

test( 'commentBlockWithCommentLine', function(t) {
  let emitter = setUp(t);
  emitter
    .expect( 'comment block', 'hello*/' )
    .expect( 'comment line' )
    .expect( 'end' );
  split( '/*hello*/a//b', emitter );
  tearDown(emitter);
});

test( 'commentBlock', function(t) {
  let emitter = setUp(t);
  emitter
    .expect( 'comment block' )
    .expect( 'end' );
  split( '/*hello*/', emitter );
  tearDown(emitter);
});

test( 'commentBlockWithNewLine', function(t) {
  let emitter = setUp(t);
  emitter
    .expect( 'comment block', '\n*/' )
    .expect( 'end' );
  split( '/*\n*/', emitter );
  tearDown(emitter);
});

test( 'commentBlockWithConent', function(t) {
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

