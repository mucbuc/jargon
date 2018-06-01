#!/usr/bin/env node

let fluke = require("flukejs"),
  base = require("../base"),
  test = base.test,
  splitCheck = base.splitCheck
  setUp = base.setUp;

test("commenterSingleLine", t => {
  splitCheck("// hello", setUp(t).expect("comment", "// hello"));
});

test("commentBlockWithCommentLine", t => {
  splitCheck(
    "/*hello*/a//b",
    setUp(t).expect("comment", "/*hello*/").expect("comment", "//b")
  );
});

test("commentBlock", t => {
  splitCheck("/*hello*/", setUp(t).expect("comment", "/*hello*/"));
});

test("commentBlockWithNewLine", t => {
  splitCheck("/*\n*/", setUp(t).expect("comment", "/*\n*/"));
});

test("commentBlockWithContent", t => {
  splitCheck("/*\nhello*/", setUp(t).expect("comment", "/*\nhello*/"));
});
