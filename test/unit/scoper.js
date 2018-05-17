#!/usr/bin/env node

var assert = require("assert"),
  Scoper = require("../../src/scoper"),
  fluke = require("flukejs"),
  base = require("../base"),
  setUp = base.setUp,
  tearDown = base.tearDown,
  test = base.test;

assert(typeof Scoper === "function");

test("emptyScope", t => {
  splitCheck(
    "namespace bla {}",
    setUp(t)
      .expect("open")
      .expect("close", "")
      .expect("end")
  );
});

test("statementScope", t => {
  splitCheck(
    "namespace bla { hello; }",
    setUp(t)
      .expect("open")
      .expect("close", "hello;")
      .expect("end")
  );
});

test("basicScope", t => {
  splitCheck(
    "namespace bla { hello }",
    setUp(t)
      .expect("open")
      .expect("close", "hello")
      .expect("end")
  );
});

test("nestedScopes", t => {
  splitCheck(
    "namespace hello{ namespace world{ namespace {} } }",
    setUp(t)
      .expect("open")
      .expect("close", "namespace world{ namespace {} }")
      .expect("end")
  );
});

test("aggregateScopes", t => {
  splitCheck(
    "namespace outside{ namespace inside1 {} namespace inside2 {} }",
    setUp(t)
      .expect("open")
      .expect("close", "namespace inside1 {} namespace inside2 {}")
      .expect("end")
  );
});

test("alternativeScopeTag", t => {
  splitCheck(
    "template< typename >",
    setUp(t)
      .expect("open")
      .expect("close", "typename")
      .expect("end"),
    { open: "<", close: ">" }
  );
});

test("alternativeScopeTagNested", t => {
  splitCheck(
    "template< template< typename > >",
    setUp(t)
      .expect("open")
      .expect("close", "template< typename >")
      .expect("end"),
    { open: "<", close: ">" }
  );
});

function splitCheck(code, emitter, rules) {
  var scoper;

  if (typeof rules === "undefined") {
    rules = { open: "{", close: "}" };
  }

  scoper = new Scoper(rules);
  fluke.splitAll(
    code,
    function(type, request) {
      emitter.emit(type, request);
      if (type == "open" || type == "close") {
        scoper.process(request, function(type, content) {
          emitter.emit(type, content);
        });
      }
    },
    rules
  );

  tearDown(emitter);
}
