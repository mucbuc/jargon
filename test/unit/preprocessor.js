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
  split("#define hello hello\n", emitter);
  tearDown(emitter);
});

test("preprocessorAfterComment", t => {
  let emitter = setUp(t)
    .expect("comment")
    .expect("format")
    .expect("preprocess");
  split("/*yo*/ #define BLA\n", emitter);
  tearDown(emitter);
});

test("preprocessorMultiple", t => {
  let emitter = setUp(t)
    .expect("preprocess")
    .repeat(1);
  split("#define A\n#define B\n", emitter);
  tearDown(emitter);
});

test("preprocessorMultiLine", t => {
  let emitter = setUp(t).expect("preprocess", "#define hello hello\\\nhello\n");
  split("#define hello hello\\\nhello\n", emitter);
  tearDown(emitter);
});
