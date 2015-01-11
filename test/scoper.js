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
      .expect( 'close', '' )
      .expect( 'end' );
    split( 'namespace bla {}' );
  }); 

  test( 'statementScope', function() {
    emitter
      .expect( 'open' )
      .expect( 'close', 'hello;' )
      .expect( 'end' );

    split( 'namespace bla { hello; }' );
  });

  test( 'basicScope', function() {
    emitter
      .expect( 'open' )
      .expect( 'close', 'hello' )
      .expect( 'end' );
    split( 'namespace bla { hello }' );
  });

  test( 'nestedScopes', function() {
    emitter
      .expect( 'open' )
      .expect( 'close', 'namespace world{ namespace {} }' )
      .expect( 'end' );
    split( 'namespace hello{ namespace world{ namespace {} } }' );
  });

  test( 'aggregateScopes', function() {
    emitter  
      .expect( 'open' )
      .expect( 'close', 'namespace inside1 {} namespace inside2 {}' )
      .expect( 'end' );
    split( 'namespace outside{ namespace inside1 {} namespace inside2 {} }' );
  });

  test( 'alternativeScopeTag', function() {
    var rules = { 'open': '<', 'close': '>' };

    emitter
      .expect( 'open' )
      .expect( 'close', 'typename' )
      .expect( 'end' );
    split( 'template< typename >', rules );
  });

  test( 'alternativeScopeTagNested', function() {
    var rules = { 'open': '<', 'close': '>' };

    emitter
      .expect( 'open' )
      .expect( 'close', 'template< typename >' )
      .expect( 'end' );
    split( 'template< template< typename > >', rules );  
  });   

  function split( code, rules ) {
  
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

});