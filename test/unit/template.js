#!/usr/bin/env node

var assert = require("assert"),
  fluke = require("flukejs"),
  base = require("../base"),
  setUp = base.setUp,
  tearDown = base.tearDown,
  test = base.test,
  split = base.split;

test("singleParameter", t => {
  tearDown(split(
    "template<class A>",
    setUp(t).expect("template parameters", "template<class A>")
  ));
});

test("singleParameter", t => {
  tearDown(split(
    "template<class A>{",
    setUp(t).expect("template parameters", "template<class A>")
  ));
});

test("singleParameter", t => {

  // emitter.expect( 'template parameters', 'template<class A>' );
  // split( 'template<class A> void text( A a ) {}', emitter );

  // emitter.expect( 'template parameters', 'template<class A>' );
  // split( 'template<class A> void text( A a );', emitter );

  tearDown(split(
    "template<class A>;",
    setUp(t).expect("template parameters", "template<class A>")
  ));
});

test("multipleParameters", t => {
  tearDown(split(
    "template< class A, class B>",
    setUp(t).expect("template parameters", "template<class A, class B>")
  ));
});

test("singleParameter", t => {
  tearDown(split(
    "template< class A, class B>;",
    setUp(t).expect("template parameters", "template<class A, class B>")
  ));
});

test("singleParameter", t => {

  // emitter.expect( 'template parameters', 'template<class A, class B>' );
  // split( 'template< class A, class B> void text( A a );', emitter );

  // emitter.expect( 'template parameters', 'template<class A, class B>' );
  // split( 'template< class A, class B> void text( A a ) {', emitter );

  tearDown(split(
    "template< class A, class B>{",
    setUp(t).expect("template parameters", "template<class A, class B>")
  ));
});

test("macroParameters", t => {
  tearDown(split(
    "template< MACRO(), MACRO >",
    setUp(t).expect("template parameters", "template<MACRO(), MACRO>")
  ));
});

test("singleParameter", t => {
  tearDown(split(
    "template< MACRO(), MACRO >;",
    setUp(t).expect("template parameters", "template<MACRO(), MACRO>")
  ));
});

test("singleParameter", t => {
  tearDown(split(
    "template< MACRO(ARG), MACRO() >;",
    setUp(t).expect("template parameters", "template<MACRO(ARG), MACRO()>")
  ));
});

test("singleParameter", t => {
  tearDown(split(
    "template< MACRO(), MACRO >;",
    setUp(t).expect("template parameters", "template<MACRO(), MACRO>")
  ));
});

test("templateNestedParameters", t => {
  tearDown(
    split(
      "template< template< typename >, template< typename > >",
      setUp(t).expect(
        "template parameters",
        "template<template< typename >, template< typename >>"
      )
    )
  );
});
