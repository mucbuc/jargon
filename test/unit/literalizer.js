#!/usr/bin/env node

var assert = require("assert"),
  base = require("../base"),
  setUp = base.setUp,
  tearDown = base.tearDown,
  test = base.test,
  split = base.split;

test("stringLiteral", t => {
  let e = setUp(t)
    .expect("literal", "struct hello;");

  split('"struct hello;"', e);
  tearDown(e);
});

test("stringLiteralWithQutationMarks", t => {
  let e = setUp(t)
    .expect("literal", 'struct hel/"lo;');

  split('"struct hel/"lo;"', e);
  tearDown(e);
});
