#!/usr/bin/env node

var assert = require("assert"),
  format = require("../../src/format.js"),
  base = require("../base"),
  setUp = base.setUp,
  tearDown = base.tearDown,
  test = base.test,
  split = base.split;

assert(typeof format === "function");

test("headingSpaces", t => {
  let emitter = setUp(t);

  emitter.expect("format", "\t \t \n ").expect("ere", "hello");

  format("ere", "\t \t \n hello", (event, code) => {
    emitter.emit(event, code);
  });

  tearDown(emitter);
});

test("trailingSpaces", t => {
  let emitter = setUp(t);

  emitter.expect("ere", "hello").expect("format", "\t \t");

  format("ere", "hello\t \t", (event, code) => {
    emitter.emit(event, code);
  });

  tearDown(emitter);
});
