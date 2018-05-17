#!/usr/bin/env node

let fluke = require("flukejs"),
  base = require("../base"),
  test = base.testN,
  splitCheck = base.splitCheck;

test("commenterSingleLine", t => {
  splitCheck("// hello", t.expect("comment", "// hello"));
});

test("commentBlockWithCommentLine", t => {
  splitCheck(
    "/*hello*/a//b",
    t.expect("comment", "/*hello*/").expect("comment", "//b")
  );
});

test("commentBlock", t => {
  splitCheck("/*hello*/", t.expect("comment", "/*hello*/"));
});

test("commentBlockWithNewLine", t => {
  splitCheck("/*\n*/", t.expect("comment", "/*\n*/"));
});

test("commentBlockWithContent", t => {
  splitCheck("/*\nhello*/", t.expect("comment", "/*\nhello*/"));
});
