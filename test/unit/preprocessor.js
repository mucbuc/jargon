#!/usr/bin/env node

var assert = require("assert"),
  events = require("events"),
  fluke = require("flukejs"),
  base = require("../base"),
  setUp = base.setUp,
  tearDown = base.tearDown,
  test = base.test,
  splitCheck = base.splitCheck;

test("preprocessorSingleLine", t => {
  let emitter = setUp(t).expect("preprocess", "#define hello hello\n");
  splitCheck("#define hello hello\n", emitter);
});

test("preprocessorMultiple", t => {
  let emitter = setUp(t)
    .expect("preprocess")
    .repeat(1);
  splitCheck("#define A\n#define B\n", emitter);
});

test("preprocessorMultiLine", t => {
  let emitter = setUp(t).expect("preprocess", "#define hello hello\\\nhello\n");
  splitCheck("#define hello hello\\\nhello\n", emitter);
});
