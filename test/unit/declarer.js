#!/usr/bin/env node

var assert = require("assert"),
  base = require("../base"),
  setUp = base.setUp,
  tearDown = base.tearDown,
  test = base.test,
  splitCheck = base.splitCheck;

test("declareType", t => {
  let e = setUp(t).expect("declare type");
  splitCheck("struct bla;", e);
});

test("declareFunction", t => {
  let e = setUp(t).expect("declare function", "void foo()");
  splitCheck("void foo();", e);
});

test("declareConstFunction", t => {
  let e = setUp(t).expect("declare function", "void foo() const");
  splitCheck("void foo() const;", e);
});

test.only("declareOperator>", t => {
  splitCheck(
    "void operator>();",
    setUp(t).expect("declare function", "void operator>()")
  );
});

test("declareNot1", t => {
  let e = setUp(t).expect("code line");
  splitCheck("bla bla;", e);
});

test("declareNot2", t => {
  let e = setUp(t).expect("code line");
  splitCheck("bla += bla();", e);
});
