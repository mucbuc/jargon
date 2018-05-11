#!/usr/bin/env node

let fluke = require("flukejs"),
  base = require("../base"),
  setUp = base.setUp,
  tearDown = base.tearDown,
  test = base.test,
  split = base.split;

test("commenterSingleLineWithSpace", t => {
  let emitter = setUp(t)
    .expect("format", "  ")
    .expect("comment", "// hello")
    .expect("format");

  split("  // hello\n", emitter);
  tearDown(emitter);
});

test("commenterSingleLine", t => {
  let emitter = setUp(t).expect("comment", "// hello");

  split("// hello", emitter);
  tearDown(emitter);
});

test("commenterSingleLineWithoutNewLine", t => {
  let emitter = setUp(t).expect("comment");
  split("// hello", emitter);
  tearDown(emitter);
});

test("commenterTwoSingleLineWithoutNewLine", t => {
  let emitter = setUp(t)
    .expect("comment")
    .expect("format")
    .expect("comment");
  split("// hello\n//hello", emitter);
  tearDown(emitter);
});

test("commentBlockWithCommentLine", t => {
  let emitter = setUp(t)
    .expect("comment", "/*hello*/")
    .expect("comment", "//b");
  split("/*hello*/a//b", emitter);
  tearDown(emitter);
});

test("commentBlock", t => {
  let emitter = setUp(t).expect("comment", "/*hello*/");
  split("/*hello*/", emitter);
  tearDown(emitter);
});

test("commentBlockWithNewLine", t => {
  let emitter = setUp(t).expect("comment", "/*\n*/");
  split("/*\n*/", emitter);
  tearDown(emitter);
});

test("commentBlockWithConent", t => {
  let emitter = setUp(t).expect("comment", "/*\nhello*/");
  split("/*\nhello*/", emitter);
  tearDown(emitter);
});
