#!/usr/bin/env node

var assert = require("assert"),
  base = require("../base"),
  setUp = base.setUp,
  tearDown = base.tearDown,
  test = base.test,
  split = base.split;

test("declareType", t => {
  let e = setUp(t)
    .expect("declare type");
  tearDown(split("struct bla;", e));
});

test("declareFunction", t => {
  let e = setUp(t)
    .expect("declare function", "void foo()");
  tearDown(split("void foo();", e));
});

test("declareConstFunction", t => {
  let e = setUp(t)
    .expect("declare function", "void foo() const");
  tearDown(split("void foo() const;", e));
});

test("declareNot1", t => {
  let e = setUp(t)
    .expect("code line");
  tearDown(split("bla bla;", e));
});

test("declareNot2", t => {
  let e = setUp(t)
    .expect("code line");
  tearDown(split("bla += bla();", e));
});
