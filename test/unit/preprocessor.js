#!/usr/bin/env node

var assert = require("assert"),
  events = require("events"),
  fluke = require("flukejs"),
  base = require("../base"),
  setUp = base.setUp,
  tearDown = base.tearDown,
  test = base.test,
  split = base.split;

test("preprocessorSingleLine", t => {
  let emitter = setUp(t).expect("preprocess", "#define hello hello\n");
  tearDown(split("#define hello hello\n", emitter));
});

test("preprocessorMultiple", t => {
  let emitter = setUp(t)
    .expect("preprocess")
    .repeat(1);
  tearDown(split("#define A\n#define B\n", emitter));
});

test("preprocessorMultiLine", t => {
  let emitter = setUp(t).expect("preprocess", "#define hello hello\\\nhello\n");
  tearDown(split("#define hello hello\\\nhello\n", emitter));
});
