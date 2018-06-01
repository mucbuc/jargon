#!/usr/bin/env node

var assert = require("assert"),
  fluke = require("flukejs"),
  base = require("../base"),
  setUp = base.setUp,
  test = base.test,
  split = base.split
  splitCheck = base.splitCheck;

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

test.skip("singleParameter function definition", t => {

  splitCheck( 'template<class A> void text( A a ) {}', 
    setUp(t).expect( 'template parameters', 'template<class A>' ) );
});

test.skip("singleParameter function declaration", t => {
  splitCheck( 'template<class A> void text( A a );', 
    setUp(t).expect( 'template parameters', 'template<class A>' ) );
});

test("singleParameter", t => {
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

test.skip("twoParameterFunction declaration", (t) => {
  split( 'template< class A, class B> void text( A a );', 
    setUp(t).expect( 'template parameters', 'template<class A, class B>' ) );
}); 

test.skip("twoParameterFunction definition", (t) => {
  split( 'template< class A, class B> void text( A a ) {', 
    setUp(t).expect( 'template parameters', 'template<class A, class B>' ) );
}); 

test("twoParameter", t => {
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
