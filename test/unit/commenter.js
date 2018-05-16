#!/usr/bin/env node

let fluke = require("flukejs"),
  base = require("../base"),
  setUp = base.setUp,
  tearDown = base.tearDown,
  test = base.test,
  split = base.split;

test("commenterSingleLine", t => {
  let emitter = setUp(t).expect("comment", "// hello");
  tearDown(split("// hello", emitter));
});

test("commentBlockWithCommentLine", t => {
  let emitter = setUp(t)
    .expect("comment", "/*hello*/")
    .expect("comment", "//b");
  tearDown(split("/*hello*/a//b", emitter));
});

test("commentBlock", t => {
  let emitter = setUp(t).expect("comment", "/*hello*/");
  tearDown(split("/*hello*/", emitter));
});

test("commentBlockWithNewLine", t => {
  let emitter = setUp(t).expect("comment", "/*\n*/");
  tearDown(split("/*\n*/", emitter));
});

test("commentBlockWithContent", t => {
  let emitter = setUp(t).expect("comment", "/*\nhello*/");
  tearDown(split("/*\nhello*/", emitter));
});
