#!/usr/bin/env node

var assert = require( 'assert' )
  , Scoper = require( '../src/scoper')
  , fluke = require( 'flukejs' )
  , test = require( './base.js' );

assert( typeof Scoper === 'function' );

test( 'emptyScope', function(emitter) {
  emitter
    .expect( 'open' )
    .expect( 'close', '' )
    .expect( 'end' );
  split( 'namespace bla {}', emitter );
}); 

test( 'statementScope', function(emitter) {
  emitter
    .expect( 'open' )
    .expect( 'close', 'hello;' )
    .expect( 'end' );

  split( 'namespace bla { hello; }', emitter );
});

test( 'basicScope', function(emitter) {
  emitter
    .expect( 'open' )
    .expect( 'close', 'hello' )
    .expect( 'end' );
  split( 'namespace bla { hello }', emitter );
});

test( 'nestedScopes', function(emitter) {
  emitter
    .expect( 'open' )
    .expect( 'close', 'namespace world{ namespace {} }' )
    .expect( 'end' );
  split( 'namespace hello{ namespace world{ namespace {} } }', emitter );
});

test( 'aggregateScopes', function(emitter) {
  emitter  
    .expect( 'open' )
    .expect( 'close', 'namespace inside1 {} namespace inside2 {}' )
    .expect( 'end' );
  split( 'namespace outside{ namespace inside1 {} namespace inside2 {} }', emitter );
});

test( 'alternativeScopeTag', function(emitter) {
  var rules = { 'open': '<', 'close': '>' };

  emitter
    .expect( 'open' )
    .expect( 'close', 'typename' )
    .expect( 'end' );
  split( 'template< typename >', emitter, rules );
});

test( 'alternativeScopeTagNested', function(emitter) {
  var rules = { 'open': '<', 'close': '>' };

  emitter
    .expect( 'open' )
    .expect( 'close', 'template< typename >' )
    .expect( 'end' );
  split( 'template< template< typename > >', emitter, rules );  
});   

function split( code, emitter, rules ) {

  var scoper; 

  if (typeof rules === 'undefined') {
    rules = { 'open': '{', 'close': '}' };
  }

  scoper = new Scoper( rules );
  fluke.splitAll( code, function( type, request ) {
      emitter.emit(type, request);
      if (type == 'open' || type == 'close') {
        scoper.process( request, function(type, content) {
          emitter.emit( type, content );
        });
      }
    }
    , rules ); 
}
