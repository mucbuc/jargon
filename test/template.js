#!/usr/bin/env node

var assert = require( 'assert' )
  , Scoper = require( '../src/scoper' )
  , Template = require( '../src/template' )
  , fluke = require( 'flukejs' )
  , tapeWrapper = require( './tape-wrapper' )
  , setUpU = tapeWrapper.setUpU
  , tearDown = tapeWrapper.tearDown
  , test = tapeWrapper.test; 

test( 'singleParameter', function(t) {

  let emitter = setUpU(t);
  emitter.expect( 'template parameters', 'template<class A>' );
  split( 'template<class A>{', emitter );

  emitter.expect( 'template parameters', 'template<class A>' );
  split( 'template<class A>;', emitter );

  emitter.expect( 'template parameters', 'template<class A>' );
  split( 'template<class A> text text {', emitter );

  emitter.expect( 'template parameters', 'template<class A>' );
  split( 'template<class A> text text;', emitter );

  emitter.expect( 'template parameters', 'template<class A>' );
  split( 'template<class A> void text( A a ) {', emitter );

  emitter.expect( 'template parameters', 'template<class A>' );
  split( 'template<class A> void text( A a );', emitter );

  tearDown(emitter);
});

test( 'multipleParameters', function(t) {

  let emitter = setUpU(t);
  
  emitter.expect( 'template parameters', 'template<class A, class B>' );
  split( 'template< class A, class B>;', emitter );

  emitter.expect( 'template parameters', 'template<class A, class B>' );
  split( 'template< class A, class B>{', emitter );

  emitter.expect( 'template parameters', 'template<class A, class B>' );
  split( 'template< class A, class B> text;', emitter );

  emitter.expect( 'template parameters', 'template<class A, class B>' );
  split( 'template< class A, class B> text{', emitter );

  emitter.expect( 'template parameters', 'template<class A, class B>' );
  split( 'template< class A, class B> void text( A a );', emitter );

  emitter.expect( 'template parameters', 'template<class A, class B>' );
  split( 'template< class A, class B> void text( A a ) {', emitter );

  tearDown(emitter);
});

test( 'macroParameters', function(t) {

  let emitter = setUpU(t);
  emitter.expect( 'template parameters', 'template<MACRO(), MACRO>' );
  split( 'template< MACRO(), MACRO >;', emitter );

  emitter.expect( 'template parameters', 'template<MACRO(ARG), MACRO()>' );
  split( 'template< MACRO(ARG), MACRO() >;', emitter );

  emitter.expect( 'template parameters', 'template<MACRO(), MACRO>' );
  split( 'template< MACRO(), MACRO >;', emitter );

  tearDown(emitter);
});

test( 'templateNestedParameters', function(t) {

  let emitter = setUpU(t);
  emitter.expect( 'template parameters', 'template<template< typename >, template< typename >>' );
  split( 'template< template< typename >, template< typename > >;', emitter );

  tearDown(emitter);
});

function split( code, emitter ) {
  var rules = { 'open': '<', 'close': '>' }
    , templater = new Template();
  
  fluke.splitAll( code, function( type, request ) {
      if (type == 'open' || type == 'close') {
        templater.process( request, (result) => {
          emitter.emit('template parameters', result);
        } ); 
      }
    }
    , rules ); 
}
