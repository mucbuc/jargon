#!/usr/bin/env node

var assert = require( 'assert' )
  , Scoper = require( '../src/scoper' )
  , Template = require( '../src/template' )
  , Expector = require( 'expector' ).Expector
  , fluke = require( 'flukejs' ); 

suite( 'template', function(){
  var emitter;
  setup(function() {
    emitter = new Expector;
    emitter.setMaxListeners( 0 );
  });

  teardown(function() {
    emitter.check(); 
    delete emitter;
  }); 

  test( 'singleParameter', function() {
    emitter.expect( 'template parameters', 'class A' );
    split( 'template<class A>{' );

    emitter.expect( 'template parameters', 'class A' );
    split( 'template<class A>;' );

    emitter.expect( 'template parameters', 'class A' );
    split( 'template<class A> text text {' );

    emitter.expect( 'template parameters', 'class A' );
    split( 'template<class A> text text;' );

    emitter.expect( 'template parameters', 'class A' );
    split( 'template<class A> void text( A a ) {' );

    emitter.expect( 'template parameters', 'class A' );
    split( 'template<class A> void text( A a );' );
  });

  test( 'multipleParameters', function() {
    
    emitter.expect( 'template parameters', 'class A, class B' );
    split( 'template< class A, class B>;' );

    emitter.expect( 'template parameters', 'class A, class B' );
    split( 'template< class A, class B>{' );

    emitter.expect( 'template parameters', 'class A, class B' );
    split( 'template< class A, class B> text;' );

    emitter.expect( 'template parameters', 'class A, class B' );
    split( 'template< class A, class B> text{' );

    emitter.expect( 'template parameters', 'class A, class B' );
    split( 'template< class A, class B> void text( A a );' );

    emitter.expect( 'template parameters', 'class A, class B' );
    split( 'template< class A, class B> void text( A a ) {' );
  });

  test( 'macroParameters', function() {
    emitter.expect( 'template parameters', 'MACRO(), MACRO' );
    split( 'template< MACRO(), MACRO >;' );

    emitter.expect( 'template parameters', 'MACRO(ARG), MACRO()' );
    split( 'template< MACRO(ARG), MACRO() >;' );

    emitter.expect( 'template parameters', 'MACRO(), MACRO' );
    split( 'template< MACRO(), MACRO >;' );
  });
  
  test( 'templateNestedParameters', function() {
    emitter.expect( 'template parameters', ' template< typename >, template< typename > ' );
    split( 'template< template< typename >, template< typename > >;' );
  });

  function split( code ) {
  var rules = { 'open': '{', 'statement': ';' }
    , tokenizer = new Scoper( emitter, rules )
    , templater = new Template( emitter );
    
    fluke.splitAll( code, function( type, request ) {
        emitter.emit(type, request);
      }
      , rules ); 
  }
});
