#!/usr/bin/env node

var assert = require( 'assert' )
  , Scoper = require( '../src/scoper' )
  , Definer = require( '../src/definer' )
  , fluke = require( 'flukejs' )
  , tapeWrapper = require( './tape-wrapper' )
  , setUp = tapeWrapper.setUp
  , tearDown = tapeWrapper.tearDown
  , test = tapeWrapper.test;

assert( typeof Definer === 'function' );

test( 'defineNamespace', t =>  {
  let emitter = setUp(t);
  emitter
    .expectNot( 'define type' )
    .expectNot( 'define function' )
    .expect( 'open' )
    .expect( 'define namespace', { name: 'namespace hello ' } );

  expectScopeTrail( emitter );

  split( 'namespace hello { this is it }', emitter );
  tearDown(emitter);
}); 

test( 'defineEmptyNamespace', t =>  {
  let emitter = setUp(t);
  emitter
    .expectNot( 'define type' )
    .expectNot( 'define function' )
    .expect( 'open' )
    .expect( 'define namespace', { name: 'namespace hello ' } );

  expectScopeTrail( emitter );
  
  split( 'namespace hello {}', emitter );
  tearDown(emitter);
});

test( 'defineTypeWithStatement', t =>  {
  let emitter = setUp(t);
  emitter
    .expectNot( 'define namespace' )
    .expectNot( 'define function' )
    .expect( 'open' )
    .expect( 'define type', { name: 'struct hello ' } );

  expectScopeTrail( emitter );
  
  split( 'struct hello { unsigned world; }', emitter );
  tearDown(emitter);
});

test( 'defineType', t =>  {
  let emitter = setUp(t);
  emitter
    .expectNot( 'define namespace' )
    .expectNot( 'define function' )
    .expect( 'open' )
    .expect( 'define type', { name: 'struct cya ' } );

  expectScopeTrail( emitter );
  
  split( 'struct cya { yes}', emitter );
  tearDown(emitter);
});

test( 'defineTypeAfterStatement', t =>  {
  let emitter = setUp(t);
  emitter
    .expectNot( 'define namespace' )
    .expectNot( 'define function' )
    .expect( 'open' )
    .expect( 'define type', { name: ' struct cya ' } );

  expectScopeTrail( emitter );
  
  split( 'typedef hello string; struct cya { yes}', emitter );
  tearDown(emitter);
});

test( 'defineSubType', t =>  {
  let emitter = setUp(t);
  emitter
    .expect( 'open' )
    .expect( 'define type', { name: 'struct cya ', meta: ' blu ' } );

  expectScopeTrail( emitter );
  
  split( 'struct cya : blu { yes }', emitter );
  tearDown(emitter);
});

test( 'defineFunction', t =>  {
  let emitter = setUp(t);
  emitter
    .expectNot( 'define namespace' )
    .expectNot( 'define type' )
    .expect( 'open' )
    .expect( 'define function', { name: 'void foo() ' } );

  expectScopeTrail( emitter );

  split( 'void foo() { do something }', emitter );
  tearDown(emitter);
} );

test ( 'dontDefineFunctionOnIf', t =>  {
  let emitter = setUp(t);
  emitter
    .expectNot( 'define function' )
    .expect( 'open' )
    .expect( 'close' )
    .expect( 'end' );

  split( 'if(hello){what up now;}', emitter );
  tearDown(emitter);
}); 

test ( 'dontDefineFunctionOnSwitch', t =>  {
  let emitter = setUp(t);
  emitter
    .expectNot( 'define function' )
    .expect( 'open' )
    .expect( 'close' )
    .expect( 'end' );

  split( 'switch(hello){case "what":}', emitter );
  tearDown(emitter);
});

test ( 'dontDefineFunctionOnFor', t =>  {
  let emitter = setUp(t);
  emitter
    .expectNot( 'define function' )
    .expect( 'open' )
    .expect( 'close' )
    .expect( 'end' );

  split( 'for(hello, bye){case "what":}', emitter );
  tearDown(emitter);
});

test ( 'dontDefineFunctionOnWhile', t =>  {
  let emitter = setUp(t);
  emitter
    .expectNot( 'define function' )
    .expect( 'open' )
    .expect( 'close' )
    .expect( 'end' );

  split( 'while(hello, bye){case "what":}', emitter );
  tearDown(emitter);
});

test ( 'dontDefineFunctionOnDo', t =>  {
  let emitter = setUp(t);
  emitter
    .expectNot( 'define function' )
    .expect( 'open' )
    .expect( 'close' )
    .expect( 'end' );

  split( 'do(hello, bye){case "what":}', emitter );
  tearDown(emitter);
});

test( 'defineMemberFunction', t =>  {
  let emitter = setUp(t);
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
  tearDown(emitter);
});

test( 'defineNamespaceWithWhite', t => {
  let emitter = setUp(t);
  emitter
    .expectNot( 'define type' )
    .expectNot( 'define function' )
    .expect( 'open' )
    .expect( 'define namespace', { name: ' namespace hello ' } );

  expectScopeTrail( emitter );

  split( ' namespace hello { this is it }', emitter );
  tearDown(emitter);
});

test( 'defineEmptyNamespace', t => {
  let emitter = setUp(t);
  emitter
    .expectNot( 'define type' )
    .expectNot( 'define function' )
    .expect( 'open' )
    .expect( 'define namespace', { name: '  namespace world' } );

  expectScopeTrail( emitter );

  split( '  namespace world{}', emitter );
  tearDown(emitter);
});

test( 'defineNamespaceWithWhite', t => {
  let emitter = setUp(t);
  emitter
    .expectNot( 'define type' )
    .expectNot( 'define function' )
    .expect( 'open' )
    .expect( 'define namespace', { name: 'namespace   world ' } )

  expectScopeTrail( emitter );

  split( 'namespace   world {}', emitter );

  tearDown(emitter);
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
