#!/usr/bin/env node

var assert = require("assert"),
  base = require("../base"),
  setUp = base.setUp,
  tearDown = base.tearDown,
  test = base.test,
  splitCheck = base.splitCheck;

test("stringLiteral", t => {
  let e = setUp(t)
    .expect("literal", "struct hello;");
  splitCheck('"struct hello;"', e);
});

test("stringLiteralWithQutationMarks", t => {
  let e = setUp(t)
    .expect("literal", 'struct hel/"lo;');
  splitCheck('"struct hel/"lo;"', e);
});
