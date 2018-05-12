#!/usr/bin/env node

var assert = require("assert"),
  base = require("../base"),
  setUpU = base.setUpU,
  tearDown = base.tearDown,
  test = base.test,
  split = base.split;

test("stringLiteral", t => {
  let e = setUpU(t)
    .expectNot("declare")
    .expect("literal", "struct hello;");

  split('"struct hello;"', e);
  tearDown(e);
});

test("stringLiteralWithQutationMarks", t => {
  let e = setUpU(t)
    .expectNot("declare")
    .expect("literal", 'struct hel/"lo;');

  split('"struct hel/"lo;"', e);
  tearDown(e);
});
