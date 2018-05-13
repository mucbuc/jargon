#!/usr/bin/env node

let fluke = require("flukejs"),
  base = require("./base"),
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

test("defineTypeAfterStatement", t => {
  tearDown(
    split(
      "typedef hello string; struct cya { inside }",
      setUp(t)
        .expectNot("define namespace")
        .expectNot("define function")
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
        .expectNot("define type")
        .expectNot("define function")
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
