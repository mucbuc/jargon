#!/usr/bin/env node

var assert = require( 'assert' )
  , Scoper = require( '../src/scoper' )
  , Template = require( '../src/template' )
  , fluke = require( 'flukejs' )
  , tapeWrapper = require( './tape-wrapper' )
  , setUpU = tapeWrapper.setUpU
  , tearDown = tapeWrapper.tearDown
  , test = tapeWrapper.test
  , splitjs = require( './../src/split' ); 

test( 'singleParameter', t => {

  let emitter = setUpU(t);
  emitter.expect( 'template parameters', 'template<class A>' );
  split( 'template<class A>', emitter );

  tearDown(emitter);
});

test( 'multipleParameters', t => {

  let emitter = setUpU(t);
  
  emitter.expect( 'template parameters', 'template<class A, class B>' );
  split( 'template< class A, class B>', emitter );

  tearDown(emitter);
});

test( 'macroParameters', t => {

  let emitter = setUpU(t);
  emitter.expect( 'template parameters', 'template<MACRO(), MACRO>' );
  split( 'template< MACRO(), MACRO >', emitter );

  tearDown(emitter);
});

test( 'templateNestedParameters', t => {

  let emitter = setUpU(t);
  emitter.expect( 'template parameters', 'template<template< typename >, template< typename >>' );
  split( 'template< template< typename >, template< typename > >', emitter );

  tearDown(emitter);
});

function split( code, emitter ) {
  splitjs(code, (type, value) => {
    emitter.emit( type, value );
  });
}
