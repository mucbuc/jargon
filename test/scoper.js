#!/usr/bin/env node

var assert = require( 'assert' )
  , Scoper = require( '../src/scoper')
  , Expector = require( 'expector' ).SeqExpector
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

  test( 'emptyScope', function() {
    emitter
      .expect( 'open' )
      .expect( 'open scope', 'namespace bla' )
      .expect( 'close scope', '' )
      .expect( 'close' )
      .expect( 'end' );
    split( 'namespace bla {}' );
  }); 

  test( 'statementScope', function() {
    emitter
      .expect( 'open' )
      .expect( 'open scope', 'namespace bla' )
      .expect( 'close scope', 'hello;' )
      .expect( 'close' )
      .expect( 'end' );

    split( 'namespace bla { hello; }' );
  });

  test( 'basicScope', function() {
    emitter
      .expect( 'open' )
      .expect( 'open scope', 'namespace bla' )
      .expect( 'close scope', 'hello' )
      .expect( 'close' )
      .expect( 'end' );
    split( 'namespace bla { hello }' );
  });

  test( 'nestedScopes', function() {
    emitter
      .expect( 'open' )
      .expect( 'open scope', 'namespace hello' )
      .expect( 'close scope', 'namespace world{ namespace {} }' )
      .expect( 'close' )
      .expect( 'end' );
    split( 'namespace hello{ namespace world{ namespace {} } }' );
  });

  test( 'aggregateScopes', function() {
    emitter  
      .expect( 'open' )
      .expect( 'open scope', 'namespace outside' )
      .expect( 'close scope', 'namespace inside1 {} namespace inside2 {}' )
      .expect( 'close' )
      .expect( 'end' );
    split( 'namespace outside{ namespace inside1 {} namespace inside2 {} }' );
  });

  test( 'alternativeScopeTag', function() {
    var rules = { 'open': '<', 'close': '>' };

    emitter
      .expect( 'open' )
      .expect( 'open scope', 'template' )
      .expect( 'close scope', 'typename' )
      .expect( 'close' )
      .expect( 'end' );
    split( 'template< typename >', rules );
  });

  test( 'alternativeScopeTagNested', function() {
    var rules = { 'open': '<', 'close': '>' };

    emitter
      .expect( 'open' )
      .expect( 'open scope', 'template' )
      .expect( 'close scope', 'template< typename >' )
      .expect( 'close' )
      .expect( 'end' );
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