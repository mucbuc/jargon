#!/usr/bin/env node

var assert = require( 'assert' )
  , Scoper = require( '../src/scoper' )
  , Template = require( '../src/template' )
  , fluke = require( 'flukejs' )
  , test = require( './seqbase.js' ); 

/*
test( 'singleParameter', function(emitter) {
  emitter.expect( 'template parameters', 'class A' );
  split( 'template<class A>{', emitter );

  emitter.expect( 'template parameters', 'class A' );
  split( 'template<class A>;', emitter );

  emitter.expect( 'template parameters', 'class A' );
  split( 'template<class A> text text {', emitter );

  emitter.expect( 'template parameters', 'class A' );
  split( 'template<class A> text text;', emitter );

  emitter.expect( 'template parameters', 'class A' );
  split( 'template<class A> void text( A a ) {', emitter );

  emitter.expect( 'template parameters', 'class A' );
  split( 'template<class A> void text( A a );', emitter );
});

test( 'multipleParameters', function(emitter) {
  
  emitter.expect( 'template parameters', 'class A, class B' );
  split( 'template< class A, class B>;', emitter );

  emitter.expect( 'template parameters', 'class A, class B' );
  split( 'template< class A, class B>{', emitter );

  emitter.expect( 'template parameters', 'class A, class B' );
  split( 'template< class A, class B> text;', emitter );

  emitter.expect( 'template parameters', 'class A, class B' );
  split( 'template< class A, class B> text{', emitter );

  emitter.expect( 'template parameters', 'class A, class B' );
  split( 'template< class A, class B> void text( A a );', emitter );

  emitter.expect( 'template parameters', 'class A, class B' );
  split( 'template< class A, class B> void text( A a ) {', emitter );
});

test( 'macroParameters', function(emitter) {
  emitter.expect( 'template parameters', 'MACRO(), MACRO' );
  split( 'template< MACRO(), MACRO >;', emitter );

  emitter.expect( 'template parameters', 'MACRO(ARG), MACRO()' );
  split( 'template< MACRO(ARG), MACRO() >;', emitter );

  emitter.expect( 'template parameters', 'MACRO(), MACRO' );
  split( 'template< MACRO(), MACRO >;', emitter );
});

test( 'templateNestedParameters', function(emitter) {
  emitter.expect( 'template parameters', ' template< typename >, template< typename > ' );
  split( 'template< template< typename >, template< typename > >;', emitter );
});

*/

function split( code, emitter ) {
var rules = { 'open': '{', 'statement': ';' }
  , tokenizer = new Scoper( emitter, rules )
  , templater = new Template( emitter );
  
  fluke.splitAll( code, function( type, request ) {
      emitter.emit(type, request);
    }
    , rules ); 
}
