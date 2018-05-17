#!/usr/bin/env node

var assert = require("assert"),
  fluke = require("flukejs"),
  base = require("../base"),
  setUp = base.setUp,
  test = base.test,
  split = base.split;

test("singleParameter", t => {
  splitCheck(
    "template<class A>",
    setUp(t).expect("template parameters", "template<class A>")
  );
});

test("singleParameter", t => {
  splitCheck(
    "template<class A>{",
    setUp(t).expect("template parameters", "template<class A>")
  );
});

test("singleParameter", t => {

  // emitter.expect( 'template parameters', 'template<class A>' );
  // split( 'template<class A> void text( A a ) {}', emitter );

  // emitter.expect( 'template parameters', 'template<class A>' );
  // split( 'template<class A> void text( A a );', emitter );

  splitCheck(
    "template<class A>;",
    setUp(t).expect("template parameters", "template<class A>")
  );
});

test("multipleParameters", t => {
  splitCheck(
    "template< class A, class B>",
    setUp(t).expect("template parameters", "template<class A, class B>")
  );
});

test("singleParameter", t => {
  splitCheck(
    "template< class A, class B>;",
    setUp(t).expect("template parameters", "template<class A, class B>")
  );
});

test("singleParameter", t => {

  // emitter.expect( 'template parameters', 'template<class A, class B>' );
  // split( 'template< class A, class B> void text( A a );', emitter );

  // emitter.expect( 'template parameters', 'template<class A, class B>' );
  // split( 'template< class A, class B> void text( A a ) {', emitter );

  splitCheck(
    "template< class A, class B>{",
    setUp(t).expect("template parameters", "template<class A, class B>")
  );
});

test("macroParameters", t => {
  splitCheck(
    "template< MACRO(), MACRO >",
    setUp(t).expect("template parameters", "template<MACRO(), MACRO>")
  );
});

test("singleParameter", t => {
  splitCheck(
    "template< MACRO(), MACRO >;",
    setUp(t).expect("template parameters", "template<MACRO(), MACRO>")
  );
});

test("singleParameter", t => {
  splitCheck(
    "template< MACRO(ARG), MACRO() >;",
    setUp(t).expect("template parameters", "template<MACRO(ARG), MACRO()>")
  );
});

test("singleParameter", t => {
  splitCheck(
    "template< MACRO(), MACRO >;",
    setUp(t).expect("template parameters", "template<MACRO(), MACRO>")
  );
});

test("templateNestedParameters", t => {
  splitCheck(
    "template< template< typename >, template< typename > >",
    setUp(t).expect(
      "template parameters",
      "template<template< typename >, template< typename >>"
    )
  );
});
