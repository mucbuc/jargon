#!/usr/bin/env node

var assert = require( 'assert' )
  , Scoper = require( '../src/scoper' )
  , Definer = require( '../src/definer' )
  , Expector = require( 'expector' ).SeqExpector
  , fluke = require( 'flukejs' ); 

assert( typeof Definer === 'function' );

suite( 'definer', function() {

  var emitter;
  setup(function() {
    emitter = new Expector;
  });

  teardown(function() {
    emitter.check(); 
    delete emitter;
  }); 

  test( 'defineNamespace', function() {
    emitter
      .expectNot( 'define type' )
      .expectNot( 'define function' )
      .expect( 'open' )
      .expect( 'define namespace', { name: 'namespace hello ' } );

    expectScopeTrail( emitter );

    split( 'namespace hello { this is it }' );
  }); 

  test( 'defineEmptyNamespace', function() {
    emitter
      .expectNot( 'define type' )
      .expectNot( 'define function' )
      .expect( 'open' )
      .expect( 'define namespace', { name: 'namespace hello ' } );
  
    expectScopeTrail( emitter );
    
    split( 'namespace hello {}' );
  });

  test( 'defineTypeWithStatement', function() {
    emitter
      .expectNot( 'define namespace' )
      .expectNot( 'define function' )
      .expect( 'open' )
      .expect( 'define type', { name: 'struct hello ' } );

    expectScopeTrail( emitter );
    
    split( 'struct hello { unsigned world; }' );
  });

  test( 'defineType', function() {
    emitter
      .expectNot( 'define namespace' )
      .expectNot( 'define function' )
      .expect( 'open' )
      .expect( 'define type', { name: 'struct cya ' } );

    expectScopeTrail( emitter );
    
    split( 'struct cya { yes}' );
  });

  test( 'defineTypeAfterStatement', function() {
    emitter
      .expectNot( 'define namespace' )
      .expectNot( 'define function' )
      .expect( 'open' )
      .expect( 'define type', { name: ' struct cya ' } );

    expectScopeTrail( emitter );
    
    split( 'typedef hello string; struct cya { yes}' );
  });

  test( 'defineSubType', function() {
    emitter
      .expect( 'open' )
      .expect( 'define type', { name: 'struct cya ', meta: ' blu ' } );

    expectScopeTrail( emitter );
    
    split( 'struct cya : blu { yes }' );
  });

  test( 'defineFunction', function() {
    emitter
      .expectNot( 'define namespace' )
      .expectNot( 'define type' )
      .expect( 'open' )
      .expect( 'define function', { name: 'void foo() ' } );

    expectScopeTrail( emitter );

    split( 'void foo() { do something }' );
  } );
 
  test( 'defineMemberFunction', function() {
    emitter
      .expectNot( 'define namespace' )
      .expectNot( 'define type' )
      .expect( 'open' )
      .expect( 'define function', {
        name: 'hello::hello()',
        meta: ' base() '
    } );

    expectScopeTrail( emitter );

    split( 'hello::hello() : base() {bla bla}' );
  });


  test( 'defineNamespaceWithWhite', function(){
    emitter
      .expectNot( 'define type' )
      .expectNot( 'define function' )
      .expect( 'open' )
      .expect( 'define namespace', { name: ' namespace hello ' } );

    expectScopeTrail( emitter );

    split( ' namespace hello { this is it }' );
  });


  test( 'defineEmptyNamespace', function(){
    emitter
      .expectNot( 'define type' )
      .expectNot( 'define function' )
      .expect( 'open' )
      .expect( 'define namespace', { name: '  namespace world' } );

    expectScopeTrail( emitter );

    split( '  namespace world{}' );
  });

  test( 'defineNamespaceWithWhite', function(){
    emitter
      .expectNot( 'define type' )
      .expectNot( 'define function' )
      .expect( 'open' )
      .expect( 'define namespace', { name: 'namespace   world ' } )

    expectScopeTrail( emitter );

    split( 'namespace   world {}' );
  });

  function expectScopeTrail(emitter) {
    return emitter
      .expect( 'close' )
      .expect( 'end' );
  }

  function split( code ) {
    var tokenizer
      , definer
      , rules = {
          'open': '{',
          'close': '}',
      };
      
    definer = new Definer();
    tokenizer = new Scoper( rules );
    fluke.splitAll( code, function( type, request ) {
        emitter.emit(type, request);
        if (type == 'open') {
          definer.process( request, function(type, content) {
            emitter.emit( type, content );
          });
        }
      }
      , rules ); 
  }
});
