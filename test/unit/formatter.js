#!/usr/bin/env node

var assert = require("assert"),
  format = require("../../src/formatter.js"),
  tapeWrapper = require("./tape-wrapper"),
  setUp = tapeWrapper.setUp,
  tearDown = tapeWrapper.tearDown,
  test = tapeWrapper.test;

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
