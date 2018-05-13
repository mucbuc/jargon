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
  tearDown(
    split(
      "namespace bla {}",
      setUp(t)
        .expect("open")
        .expect("close", "")
        .expect("end")
    )
  );
});

test("statementScope", t => {
  tearDown(
    split(
      "namespace bla { hello; }",
      setUp(t)
        .expect("open")
        .expect("close", "hello;")
        .expect("end")
    )
  );
});

test("basicScope", t => {
  tearDown(
    split(
      "namespace bla { hello }",
      setUp(t)
        .expect("open")
        .expect("close", "hello")
        .expect("end")
    )
  );
});

test("nestedScopes", t => {
  tearDown(
    split(
      "namespace hello{ namespace world{ namespace {} } }",
      setUp(t)
        .expect("open")
        .expect("close", "namespace world{ namespace {} }")
        .expect("end")
    )
  );
});

test("aggregateScopes", t => {
  tearDown(
    split(
      "namespace outside{ namespace inside1 {} namespace inside2 {} }",
      setUp(t)
        .expect("open")
        .expect("close", "namespace inside1 {} namespace inside2 {}")
        .expect("end")
    )
  );
});

test("alternativeScopeTag", t => {
  tearDown(
    split(
      "template< typename >",
      setUp(t)
        .expect("open")
        .expect("close", "typename")
        .expect("end"),
      { open: "<", close: ">" }
    )
  );
});

test("alternativeScopeTagNested", t => {
  tearDown(split("template< template< typename > >", setUp(t)
    .expect("open")
    .expect("close", "template< typename >")
    .expect("end"), { open: "<", close: ">" }));
});

function split(code, emitter, rules) {
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

  return emitter;
}
