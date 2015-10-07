#!/usr/bin/env node

var assert = require( 'assert' )
  , Scoper = require( '../src/scoper' )
  , Definer = require( '../src/definer' )
  , fluke = require( 'flukejs' )
  , test = require( './base.js' ).testSequence;

assert( typeof Definer === 'function' );

test( 'defineNamespace', function(emitter) {
  emitter
    .expectNot( 'define type' )
    .expectNot( 'define function' )
    .expect( 'open' )
    .expect( 'define namespace', { name: 'namespace hello ' } );

  expectScopeTrail( emitter );

  split( 'namespace hello { this is it }', emitter );
}); 

test( 'defineEmptyNamespace', function(emitter) {
  emitter
    .expectNot( 'define type' )
    .expectNot( 'define function' )
    .expect( 'open' )
    .expect( 'define namespace', { name: 'namespace hello ' } );

  expectScopeTrail( emitter );
  
  split( 'namespace hello {}', emitter );
});

test( 'defineTypeWithStatement', function(emitter) {
  emitter
    .expectNot( 'define namespace' )
    .expectNot( 'define function' )
    .expect( 'open' )
    .expect( 'define type', { name: 'struct hello ' } );

  expectScopeTrail( emitter );
  
  split( 'struct hello { unsigned world; }', emitter );
});

test( 'defineType', function(emitter) {
  emitter
    .expectNot( 'define namespace' )
    .expectNot( 'define function' )
    .expect( 'open' )
    .expect( 'define type', { name: 'struct cya ' } );

  expectScopeTrail( emitter );
  
  split( 'struct cya { yes}', emitter );
});

test( 'defineTypeAfterStatement', function(emitter) {
  emitter
    .expectNot( 'define namespace' )
    .expectNot( 'define function' )
    .expect( 'open' )
    .expect( 'define type', { name: ' struct cya ' } );

  expectScopeTrail( emitter );
  
  split( 'typedef hello string; struct cya { yes}', emitter );
});

test( 'defineSubType', function(emitter) {
  emitter
    .expect( 'open' )
    .expect( 'define type', { name: 'struct cya ', meta: ' blu ' } );

  expectScopeTrail( emitter );
  
  split( 'struct cya : blu { yes }', emitter );
});

test( 'defineFunction', function(emitter) {
  emitter
    .expectNot( 'define namespace' )
    .expectNot( 'define type' )
    .expect( 'open' )
    .expect( 'define function', { name: 'void foo() ' } );

  expectScopeTrail( emitter );

  split( 'void foo() { do something }', emitter );
} );

test ( 'dontDefineFunctionOnIf', function(emitter) {
  emitter
    .expectNot( 'define function' )
    .expect( 'open' )
    .expect( 'close' )
    .expect( 'end' );

  split( 'if(hello){what up now;}', emitter );
}); 

test ( 'dontDefineFunctionOnSwitch', function(emitter) {
  emitter
    .expectNot( 'define function' )
    .expect( 'open' )
    .expect( 'close' )
    .expect( 'end' );

  split( 'switch(hello){case "what":}', emitter );
});

test ( 'dontDefineFunctionOnFor', function(emitter) {
  emitter
    .expectNot( 'define function' )
    .expect( 'open' )
    .expect( 'close' )
    .expect( 'end' );

  split( 'for(hello, bye){case "what":}', emitter );
});

test ( 'dontDefineFunctionOnWhile', function(emitter) {
  emitter
    .expectNot( 'define function' )
    .expect( 'open' )
    .expect( 'close' )
    .expect( 'end' );

  split( 'while(hello, bye){case "what":}', emitter );
});

test ( 'dontDefineFunctionOnDo', function(emitter) {
  emitter
    .expectNot( 'define function' )
    .expect( 'open' )
    .expect( 'close' )
    .expect( 'end' );

  split( 'do(hello, bye){case "what":}', emitter );
});

test( 'defineMemberFunction', function(emitter) {
  emitter
    .expectNot( 'define namespace' )
    .expectNot( 'define type' )
    .expect( 'open' )
    .expect( 'define function', {
      name: 'hello::hello()',
      meta: ' base() '
  } );

  expectScopeTrail( emitter );

  split( 'hello::hello() : base() {bla bla}', emitter );
});


test( 'defineNamespaceWithWhite', function(emitter){
  emitter
    .expectNot( 'define type' )
    .expectNot( 'define function' )
    .expect( 'open' )
    .expect( 'define namespace', { name: ' namespace hello ' } );

  expectScopeTrail( emitter );

  split( ' namespace hello { this is it }', emitter );
});


test( 'defineEmptyNamespace', function(emitter){
  emitter
    .expectNot( 'define type' )
    .expectNot( 'define function' )
    .expect( 'open' )
    .expect( 'define namespace', { name: '  namespace world' } );

  expectScopeTrail( emitter );

  split( '  namespace world{}', emitter );
});

test( 'defineNamespaceWithWhite', function(emitter){
  emitter
    .expectNot( 'define type' )
    .expectNot( 'define function' )
    .expect( 'open' )
    .expect( 'define namespace', { name: 'namespace   world ' } )

  expectScopeTrail( emitter );

  split( 'namespace   world {}', emitter );
});

function expectScopeTrail(emitter) {
  return emitter
    .expect( 'close' )
    .expect( 'end' );
}

function split( code, emitter ) {
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
