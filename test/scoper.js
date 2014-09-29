#!/usr/bin/env node

var assert = require( 'assert' )
  , Scoper = require( '../src/scoper')
  , Expector = require( 'expector' ).Expector
  , fluke = require( 'flukejs' ); 

assert( typeof Scoper === 'function' );

suite( 'scoper', function() {
  
  var emitter;
  setup(function() {
    emitter = new Expector;
  });

  teardown(function() {
    emitter.check(); 
    delete emitter;
  }); 

  test( 'basicScope', function() {
    emitter.expect( 'open scope', 'namespace bla' );
    emitter.expect( 'close scope', '' );
    split( 'namespace bla {}' );
    
    emitter.expect( 'open scope', 'namespace bla' );
    emitter.expect( 'close scope', 'hello;' );
    split( 'namespace bla { hello; }' );

    emitter.expect( 'open scope', 'namespace bla' );
    emitter.expect( 'close scope', 'hello' );
    split( 'namespace bla { hello }' );
  });

  test( 'nestedScopes', function() {
    emitter.expect( 'open scope', 'namespace hello' );
    emitter.expect( 'close scope', 'namespace world{ namespace {} }' );
    emitter.expect( 'end' );
    split( 'namespace hello{ namespace world{ namespace {} } }' );
  });

  test( 'aggregateScopes', function() {
    emitter.expect( 'open scope', 'namespace outside' );
    emitter.expect( 'close scope', 'namespace inside1 {} namespace inside2 {}' );
    emitter.expect( 'end' );
    split( 'namespace outside{ namespace inside1 {} namespace inside2 {} }' );
  });

  test( 'alternativeScopeTag', function() {
    var rules = { 'open': '<', 'close': '>' };

    emitter.expect( 'open scope', 'template' );
    emitter.expect( 'close scope', 'typename' );
    split( 'template< typename >', rules );

    emitter.expect( 'open scope', 'template' );
    emitter.expect( 'close scope', 'template< typename >' );
    split( 'template< template< typename > >', rules );  
  });   

  function split( code, rules ) {
  
    var tokenizer; 

    if (typeof rules === 'undefined') {
      rules = { 'open': '{', 'close': '}' };
    }

    tokenizer = new Scoper( emitter, rules );
    fluke.splitAll( code, function( type, request ) {
        emitter.emit(type, request);
      }
      , rules ); 
  }

});