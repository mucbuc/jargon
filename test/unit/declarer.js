#!/usr/bin/env node

var assert = require("assert"),
  tapeWrapper = require("../tape-wrapper"),
  setUp = tapeWrapper.setUp,
  tearDown = tapeWrapper.tearDown,
  test = tapeWrapper.test,
  split = require("../base").split;

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
