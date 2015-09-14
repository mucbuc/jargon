#!/usr/bin/env node

var assert = require( 'chai' ).assert
  , Commenter = require( '../src/commenter' )
  , fluke = require( 'flukejs' )
  , base = require( './base.js' )
  , test = base.test
  , emitter = base.emitter;

assert( typeof Commenter === 'function' );

test( 'commenterSingleLine', function(){
  emitter()
    .expect( 'comment line' )
    .expect( 'end' );
  split( '// hello\n' );
});

test( 'commenterSingleLineWithoutNewLine', function(){
  emitter()
    .expect( 'comment line' )
    .expect( 'end' );
  split( '// hello' );
});

test( 'commenterTwoSingleLineWithoutNewLine', function(){
  emitter()
    .expect( 'comment line' )
    .repeat( 1 )
    .expect( 'end' );
  split( '// hello\n//hello' );
});

test( 'commentBlockWithCommentLine', function() {
  emitter()
    .expect( 'comment block', 'hello*/' )
    .expect( 'comment line' )
    .expect( 'end' );
  split( '/*hello*/a//b' );
});

test( 'commentBlock', function() {
  emitter()
    .expect( 'comment block' )
    .expect( 'end' );
  split( '/*hello*/' );
});

test( 'commentBlockWithNewLine', function() {
  emitter()
    .expect( 'comment block', '\n*/' )
    .expect( 'end' );
  split( '/*\n*/' );
});

test( 'commentBlockWithConent', function() {
  emitter()
    .expect( 'comment block', 'hello*/' )
    .expect( 'end' );
  split( '/*\nhello*/' );
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
          emitter().emit( 'comment line', val );
        } );
      }
      else if (type === 'comment block') {
        commenter.processBlock( request, function(val) {
          emitter().emit( 'comment block', val );
        } );
      }
      else {
        emitter().emit( type, request );
      }
    }
    , rules ); 
}

