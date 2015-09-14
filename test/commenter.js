#!/usr/bin/env node

var assert = require( 'chai' ).assert
  , Commenter = require( '../src/commenter' )
  , fluke = require( 'flukejs' )
  , test = require( './base.js' );

assert( typeof Commenter === 'function' );

test( 'commenterSingleLine', function(emitter){
  emitter
    .expect( 'comment line' )
    .expect( 'end' );
  split( '// hello\n', emitter );
});

test( 'commenterSingleLineWithoutNewLine', function(emitter){
  emitter
    .expect( 'comment line' )
    .expect( 'end' );
  split( '// hello', emitter );
});

test( 'commenterTwoSingleLineWithoutNewLine', function(emitter){
  emitter
    .expect( 'comment line' )
    .repeat( 1 )
    .expect( 'end' );
  split( '// hello\n//hello', emitter );
});

test( 'commentBlockWithCommentLine', function(emitter) {
  emitter
    .expect( 'comment block', 'hello*/' )
    .expect( 'comment line' )
    .expect( 'end' );
  split( '/*hello*/a//b', emitter );
});

test( 'commentBlock', function(emitter) {
  emitter
    .expect( 'comment block' )
    .expect( 'end' );
  split( '/*hello*/', emitter );
});

test( 'commentBlockWithNewLine', function(emitter) {
  emitter
    .expect( 'comment block', '\n*/' )
    .expect( 'end' );
  split( '/*\n*/', emitter );
});

test( 'commentBlockWithConent', function(emitter) {
  emitter
    .expect( 'comment block', 'hello*/' )
    .expect( 'end' );
  split( '/*\nhello*/', emitter );
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

