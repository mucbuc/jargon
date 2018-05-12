#!/usr/bin/env node

let fluke = require("flukejs"),
  base = require("../base"),
  setUp = base.setUp,
  tearDown = base.tearDown,
  test = base.test,
  split = base.split;

test("commenterSingleLine", t => {
  let emitter = setUp(t).expect("comment", "// hello");

  split("// hello", emitter);
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

test("commentBlockWithContent", t => {
  let emitter = setUp(t).expect("comment", "/*\nhello*/");
  split("/*\nhello*/", emitter);
  tearDown(emitter);
});
