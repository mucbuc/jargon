#!/usr/bin/env node

var assert = require( 'assert' )
  , Scoper = require( '../src/scoper' )
  , Definer = require( '../src/definer' )
  , Expector = require( 'expector' ).Expector
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
    emitter.expectNot( 'define type' );
    emitter.expectNot( 'define function' );

    emitter.expect( 'define namespace', { name: 'namespace hello ', code: ' this is it ' } );
    split( 'namespace hello { this is it }' );

    emitter.expect( 'define namespace', { name: 'namespace world ', code: ' wtf? ' } );
    split( 'namespace world { wtf? }' );

    emitter.expect( 'define namespace', { name: 'namespace world', code: '' } );
    split( 'namespace world{}' );
  }); 

  test( 'defineType', function() {
    emitter.expectNot( 'define namespace' );
    emitter.expectNot( 'define function' );

    emitter.expect( 'define type', { name: 'struct hello ', code: ' unsigned world; ' } );
    split( 'struct hello { unsigned world; }' );

    emitter.expect( 'define type', { name: 'struct cya ', code: ' yes' } );
    split( 'struct cya { yes}' );

    emitter.expect( 'define type', { name: ' struct cya ', code: ' yes' } );
    split( 'typedef hello string; struct cya { yes}' );
  });

  test( 'defineSubType', function() {
    emitter.expect( 'define type', { name: 'struct cya ', code: ' yes ', meta: ' blu ' } );
    split( 'struct cya : blu { yes }' );
  });

  test( 'defineFunction', function(){
    emitter.expectNot( 'define namespace' );
    emitter.expectNot( 'define type' );

    emitter.expect( 'define function', { name: 'void foo() ', code: ' do something ' } );
    split( 'void foo() { do something }' );

    emitter.expect( 'define function', { name: 'void fool() ', code: ' do nothing ' } );
    split( 'void fool() { do nothing }' );

    emitter.expect( 'define function', {
      name: 'hello::hello()',
      code: 'bla bla',
      meta: ' base() '
    } );
    split( 'hello::hello() : base() {bla bla}' );
  });

  test( 'defineNamespaceWithWhite', function(){
    emitter.expectNot( 'define type' );
    emitter.expectNot( 'define function' );

    emitter.expect( 'define namespace', { name: ' namespace hello ', code: ' this is it ' } );
    split( ' namespace hello { this is it }' );

    emitter.expect( 'define namespace', { name: '  namespace world ', code: ' wtf? ' } );
    split( '  namespace world { wtf? }' );

    emitter.expect( 'define namespace', { name: '    namespace world', code: '' } );
    split( '    namespace world{}' );

    emitter.expect( 'define namespace', { name: 'namespace   world ', code: '' } );
    split( 'namespace   world {}' );
  });

  function split( code ) {
    var tokenizer
      , definer
      , rules = {
          'open': '{',
          'close': '}',
      };
      
    tokenizer = new Scoper( emitter, rules );
    definer = new Definer(emitter);
    fluke.splitAll( code, function( type, request ) {
        emitter.emit(type, request);
      }
      , rules ); 
  }
});
