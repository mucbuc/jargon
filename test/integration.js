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

test("readSampleFile", t => {
  let e = setUp(t)
    .expect("preprocess")
    .expect("declare type")
    .expect("format")
    .expect("declare function")
    .expect("format")
    .expect("code line")
    .expect("format")
    .expect("define type", {
      name: "struct hello\n",
      code: "\n  int hello;\n  void bye();\n"
    })
    .expect("format")
    .expect("define function", {
      name: "void hello() \n",
      code: "\n\n"
    })
    .expect("format")
    .expect("preprocess")
    .expect("format")
    .expect("define namespace", {
      name: "namespace hello \n",
      code: "\n  fdsa;jlsjk\n  ;kjdsafl;lj\n  ;klj\n"
    })
    .expect("format")
    .expect("comment")
    .expect("format")
    .expect("preprocess")
    .expect("comment");

  const source = `#define INCLUDE_GUARD
class hello;
void hello();
int good;
struct hello
{
  int hello;
  void bye();
};

void hello() 
{

}

#pragma lj alsdkf

namespace hello 
{
  fdsa;jlsjk
  ;kjdsafl;lj
  ;klj
}

/*


*/

#endif  // INCLUDE_GUARD`;

  tearDown(split(source, e));
});

test( 'templateAndFormat', (t) => {

  let emitter = setUp(t);

  split(
    "template<class A> text text {",
    emitter.expect("template parameters", "template<class A>").expect("format")
  );
  split(
    "template<class A> ;",
    emitter.expect("template parameters", "template<class A>").expect("format")
  );

  tearDown(emitter);
});
