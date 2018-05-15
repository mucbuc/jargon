#!/usr/bin/env node

let fluke = require("flukejs"),
  base = require("./base"),
  setUp = base.setUp,
  tearDown = base.tearDown,
  test = base.test,
  split = base.split;

test("commenterSingleLineWithSpace", t => {
  tearDown(
    split(
      "  // hello\n",
      setUp(t)
        .expect("format", "  ")
        .expect("comment", "// hello")
        .expect("format")
    )
  );
});

test("commenterSingleLineWithoutNewLine", t => {
  tearDown(split("// hello", setUp(t).expect("comment")));
});

test("commenterTwoSingleLineWithoutNewLine", t => {
  tearDown(
    split(
      "// hello\n//hello",
      setUp(t)
        .expect("comment")
        .expect("format")
        .expect("comment")
    )
  );
});

test("defineTypeAfterStatement", t => {
  tearDown(
    split(
      "typedef hello string; struct cya { inside }",
      setUp(t)
        .expect("code line")
        .expect("format")
        .expect("define type", { name: "struct cya ", code: " inside " })
    )
  );
});

test("defineNamespaceWithWhite", t => {
  tearDown(
    split(
      " namespace hello { this is it }",
      setUp(t)
        .expect("format")
        .expect("define namespace", {
          name: "namespace hello ",
          code: " this is it "
        })
    )
  );
});

test("preprocessorAfterComment", t => {
  tearDown(
    split(
      "/*yo*/ #define BLA\n",
      setUp(t)
        .expect("comment")
        .expect("format")
        .expect("preprocess")
    )
  );
});
