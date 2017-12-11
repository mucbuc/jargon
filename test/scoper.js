#!/usr/bin/env node

var assert = require( 'assert' )
  , Scoper = require( '../src/scoper')
  , fluke = require( 'flukejs' )
  , tapeWrapper = require( './tape-wrapper' )
  , setUp = tapeWrapper.setUp
  , tearDown = tapeWrapper.tearDown
  , test = tapeWrapper.test;

assert( typeof Scoper === 'function' );

test( 'emptyScope', t => {

  let emitter = setUp( t );
  
  emitter
    .expect( 'open' )
    .expect( 'close', '' )
    .expect( 'end' );
  split( 'namespace bla {}', emitter );

  tearDown(emitter);
}); 

test( 'statementScope', t => {
  let emitter = setUp( t );

  emitter
    .expect( 'open' )
    .expect( 'close', 'hello;' )
    .expect( 'end' );

  split( 'namespace bla { hello; }', emitter );

  tearDown(emitter);
});

test( 'basicScope', t => {
  let emitter = setUp( t );

  emitter
    .expect( 'open' )
    .expect( 'close', 'hello' )
    .expect( 'end' );
  split( 'namespace bla { hello }', emitter );
  tearDown(emitter);
});

test( 'nestedScopes', t => {
  let emitter = setUp( t );

  emitter
    .expect( 'open' )
    .expect( 'close', 'namespace world{ namespace {} }' )
    .expect( 'end' );
  split( 'namespace hello{ namespace world{ namespace {} } }', emitter );
  tearDown(emitter);
});

test( 'aggregateScopes', t => {
  let emitter = setUp( t );

  emitter  
    .expect( 'open' )
    .expect( 'close', 'namespace inside1 {} namespace inside2 {}' )
    .expect( 'end' );
  split( 'namespace outside{ namespace inside1 {} namespace inside2 {} }', emitter );
  tearDown(emitter);
});

test( 'alternativeScopeTag', t => {
  let emitter = setUp( t );
  var rules = { 'open': '<', 'close': '>' };

  emitter
    .expect( 'open' )
    .expect( 'close', 'typename' )
    .expect( 'end' );
  split( 'template< typename >', emitter, rules );
  tearDown(emitter);
});

test( 'alternativeScopeTagNested', t => {
  let emitter = setUp( t );
  var rules = { 'open': '<', 'close': '>' };

  emitter
    .expect( 'open' )
    .expect( 'close', 'template< typename >' )
    .expect( 'end' );
  split( 'template< template< typename > >', emitter, rules );  
  tearDown(emitter);
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
