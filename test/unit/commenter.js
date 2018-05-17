#!/usr/bin/env node

let fluke = require("flukejs"),
  base = require("../base"),
  setUp = base.setUp,
  tearDown = base.tearDown,
  test = base.test,
  split = base.split
  splitCheck = base.splitCheck;

test("commenterSingleLine", t => {
  let emitter = setUp(t).expect("comment", "// hello");
  splitCheck("// hello", emitter);
});

test("commentBlockWithCommentLine", t => {
  let emitter = setUp(t)
    .expect("comment", "/*hello*/")
    .expect("comment", "//b");
  splitCheck("/*hello*/a//b", emitter);
});

test("commentBlock", t => {
  let emitter = setUp(t).expect("comment", "/*hello*/");
  splitCheck("/*hello*/", emitter);
});

test("commentBlockWithNewLine", t => {
  let emitter = setUp(t).expect("comment", "/*\n*/");
  splitCheck("/*\n*/", emitter);
});

test("commentBlockWithContent", t => {
  let emitter = setUp(t).expect("comment", "/*\nhello*/");
  splitCheck("/*\nhello*/", emitter);
});
