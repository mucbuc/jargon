#!/usr/bin/env node

var assert = require( 'assert' )
  , Scoper = require( '../src/scoper' )
  , Declarer = require( '../src/declarer' )
  , Expector = require( 'expector' ).SeqExpector
  , fluke = require( 'flukejs' ); 

assert( typeof Declarer === 'function' );

suite( 'declarer', function() {

  var emitter;
  setup(function() {
    emitter = new Expector;
  });

  teardown(function() {
    emitter.check(); 
    delete emitter;
  }); 

  test( 'declareType', function(){
    emitter
      .expectNot( 'define type' )
      .expect( 'statement' )
      .expect( 'declare type' )
      .expect( 'end' );
    split( 'struct bla;' );
  });

  test( 'declareFunction', function(){
    emitter
      .expectNot( 'define function' )
      .expect( 'statement' )
      .expect( 'declare function', 'void foo()' )
      .expect( 'end' );
    split( 'void foo();' );
  });

  test( 'declareNot1', function(){
    emitter.expectNot( 'declare function' );
    emitter.expect( 'statement' );
    emitter.expect( 'end' );
    split( 'bla bla;' );
  });
  
  test( 'declareNot2', function(){
    emitter.expectNot( 'declare function' );
    emitter.expect( 'statement' );
    emitter.expect( 'end' );
    split( 'bla += bla();' );
  });

  test( 'ignoreSubScopes', function(){
    emitter.expectNot( 'declare type' );
    emitter.expect( 'open' );
    emitter.expect( 'open scope' );
    emitter.expect( 'close scope' );
    emitter.expect( 'end' );
    split( 'namespace { struct hello; }' );
  });

  function split( code ) {
    var rules = {
        'statement': ';',
        'open': '{'
      }
      , tokenizer = new Scoper( emitter, rules )
      , definer = new Declarer(emitter);
      
    fluke.splitAll( code, function( type, request ) {
        emitter.emit(type, request);
      }
      , rules ); 
  }
});
