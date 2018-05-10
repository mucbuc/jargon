#!/usr/bin/env node

var assert = require("assert"),
  base = require("../base"),
  setUp = base.setUp,
  tearDown = base.tearDown,
  test = base.test,
  split = base.split;

test("declareType", t => {
  let e = setUp(t)
    .expectNot("define type")
    .expect("declare type");
  split("struct bla;", e);
  tearDown(e);
});

test("declareFunction", t => {
  let e = setUp(t)
    .expectNot("define function")
    .expect("declare function", "void foo()");
  split("void foo();", e);
  tearDown(e);
});

test("declareConstFunction", t => {
  let e = setUp(t)
    .expectNot("define function")
    .expect("declare function", "void foo() const");

  split("void foo() const;", e);
  tearDown(e);
});

test("declareNot1", t => {
  let e = setUp(t)
    .expectNot("declare function")
    .expect("code line");
  split("bla bla;", e);
  tearDown(e);
});

test("declareNot2", t => {
  let e = setUp(t)
    .expectNot("declare function")
    .expect("code line");

  split("bla += bla();", e);
  tearDown(e);
});
