#!/usr/bin/env node

var assert = require( 'assert' )
  , Scoper = require( '../src/scoper' )
  , Definer = require( '../src/definer' )
  , fluke = require( 'flukejs' )
  , tapeWrapper = require( './tape-wrapper' )
  , setUp = tapeWrapper.setUp
  , tearDown = tapeWrapper.tearDown
  , test = tapeWrapper.test
  , splitjs = require( './../src/split' );

assert( typeof Definer === 'function' );

test( 'defineNamespace', t =>  {
  let emitter = setUp(t);
  emitter
    .expectNot( 'define type' )
    .expectNot( 'define function' )
    .expect( 'define namespace', { name: 'namespace hello ', code: ' this is it ' } );

  split( 'namespace hello { this is it }', emitter );
  tearDown(emitter);
}); 

test( 'defineEmptyNamespace', t =>  {
  let emitter = setUp(t);
  emitter
    .expectNot( 'define type' )
    .expectNot( 'define function' )
    .expect( 'define namespace', { name: 'namespace hello ', code: '' } );
  
  split( 'namespace hello {}', emitter );
  tearDown(emitter);
});

test( 'defineTypeWithStatement', t =>  {
  let emitter = setUp(t);
  emitter
    .expectNot( 'define namespace' )
    .expectNot( 'define function' )
    .expect( 'define type', { name: 'struct hello ', code: ' unsigned world; ' } );

  split( 'struct hello { unsigned world; }', emitter );
  tearDown(emitter);
});

test( 'defineType', t =>  {
  let emitter = setUp(t);
  emitter
    .expectNot( 'define namespace' )
    .expectNot( 'define function' )
    .expect( 'define type', { name: 'struct cya ', code: ' yes' } );
  
  split( 'struct cya { yes}', emitter );
  tearDown(emitter);
});

test( 'defineSubType', t =>  {
  let emitter = setUp(t);
  emitter
    .expect( 'define type', { name: 'struct cya ', meta: ' blu ', code: ' yes ' } );

  split( 'struct cya : blu { yes }', emitter );
  tearDown(emitter);
});

test.only( 'defineFunction', t =>  {
  let emitter = setUp(t);
  emitter
    .expectNot( 'define namespace' )
    .expectNot( 'define type' )
    .expect( 'define function', { name: 'void foo() ', code: ' do something ' } );

  split( 'void foo() { do something }', emitter );
  tearDown(emitter);
} );
/*
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
      name: 'hello::hello() -> returnType '
    });

  expectScopeTrail( emitter );

  split( 'hello::hello() -> returnType {}', emitter );
  tearDown(emitter);
});

test( 'defineConstructFunction', t =>  {
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
*/
function split( code, emitter ) {
  splitjs(code, (type, value) => {
    emitter.emit( type, value );
  });
}
