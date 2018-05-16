#!/usr/bin/env node

var assert = require("assert"),
  fluke = require("flukejs"),
  base = require("../base"),
  setUp = base.setUp,
  tearDown = base.tearDown,
  test = base.test,
  split = base.split;

test("singleParameter", t => {
  let emitter = setUp(t);

  split(
    "template<class A>",
    emitter.expect("template parameters", "template<class A>")
  );
  split(
    "template<class A>{",
    emitter.expect("template parameters", "template<class A>")
  );
  split(
    "template<class A>;",
    emitter.expect("template parameters", "template<class A>")
  );

  // emitter.expect( 'template parameters', 'template<class A>' );
  // split( 'template<class A> void text( A a ) {}', emitter );

  // emitter.expect( 'template parameters', 'template<class A>' );
  // split( 'template<class A> void text( A a );', emitter );

  tearDown(emitter);
});

test("multipleParameters", t => {
  let emitter = setUp(t);

  split(
    "template< class A, class B>",
    emitter.expect("template parameters", "template<class A, class B>")
  );

  split(
    "template< class A, class B>;",
    emitter.expect("template parameters", "template<class A, class B>")
  );

  split(
    "template< class A, class B>{",
    emitter.expect("template parameters", "template<class A, class B>")
  );

  // emitter.expect( 'template parameters', 'template<class A, class B>' );
  // split( 'template< class A, class B> void text( A a );', emitter );

  // emitter.expect( 'template parameters', 'template<class A, class B>' );
  // split( 'template< class A, class B> void text( A a ) {', emitter );

  tearDown(emitter);
});

test("macroParameters", t => {
  let emitter = setUp(t);
  split(
    "template< MACRO(), MACRO >",
    emitter.expect("template parameters", "template<MACRO(), MACRO>")
  );
  split(
    "template< MACRO(), MACRO >;",
    emitter.expect("template parameters", "template<MACRO(), MACRO>")
  );
  split(
    "template< MACRO(ARG), MACRO() >;",
    emitter.expect("template parameters", "template<MACRO(ARG), MACRO()>")
  );
  split(
    "template< MACRO(), MACRO >;",
    emitter.expect("template parameters", "template<MACRO(), MACRO>")
  );
  tearDown(emitter);
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
