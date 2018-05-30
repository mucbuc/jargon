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

test("declareOperator>", t => {
  splitCheck(
    "void operator>();",
    setUp(t).expect("declare function", "void operator>()")
  );
});

test("declareOperator>>(int a)", t => {
  splitCheck(
    "void operator>>(int a);",
    setUp(t).expect("declare function", "void operator>>(int a)")
  );
});

test("declareFunctionWeirdnessAsResult", t => {
  splitCheck(
    "T & operator>>(T & s, context<U, V> &)",
    setUp(t).expect(
      "declare function",
      "T & operator>>(T & s, context<U, V> &)"
    )
  );
});

test("declareFunctionlAmpersandSpaceAsResult", t => {
  splitCheck(
    "T& operator>>(T & s, context<U, V> &)",
    setUp(t).expect("declare function", "T& operator>>(T & s, context<U, V> &)")
  );
});

test("declareFunctionSpaceAmperSandAsResult", t => {
  splitCheck(
    "T &operator>>(T & s, context<U, V> &)",
    setUp(t).expect("declare function", "T &operator>>(T & s, context<U, V> &)")
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

test("multiple code lines", t => {
  splitCheck("bla bla;blu blu;", 
    setUp(t)
    .expect("code line", "bla bla")
    .expect("code line", "blu blu")
  );
});

test("multiple code lines with format", t => {
  splitCheck("bla bla;\nblu blu;\n", 
    setUp(t)
    .expect("code line", "bla bla")
    .expect("format")
    .expect("code line", "blu blu")
    .expect("format")
  );
});
