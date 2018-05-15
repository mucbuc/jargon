#!/usr/bin/env node

"use strict";

var assert = require("assert"),
  fs = require("fs"),
  path = require("path"),
  base = require("../base"),
  setUp = base.setUp,
  tearDown = base.tearDown,
  test = base.test,
  split = base.split;

test("commentBlockPreprocessor", t => {
  let e = setUp(t)
    .expect("comment")
    .expect("preprocess");
  tearDown(split("/**/#endif", e));
});

test("commentBlockFormatPreprocessor", t => {
  let e = setUp(t)
    .expect("comment")
    .expect("format")
    .expect("preprocess");

  tearDown(split("/**/ #endif", e));
});

test("readSampleFileTemplate", t => {
  let e = setUp(t)
    .expect("template parameters")
    .expect("declare function");
  tearDown(split(`template<class T>void foo(T);`, e));
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

test("PreprocessFollowedByBlockComment", t => {
  let e = setUp(t);

  e.expect("preprocess").expect("comment");
  tearDown(split("#define SOB 1 /* hey */", e));
});

test("PreprocessFollowedByLineComment", t => {
  let e = setUp(t);

  e
    .expect("preprocess")
    .expect("comment")
    .expect("format");
  tearDown(split("#define SOB 1 // hey\n", e));
});

test("PreprocessFollowedByLineCommentWithoutNewLine", t => {
  let e = setUp(t);

  e.expect("preprocess").expect("comment");
  tearDown(split("#define SOB 1 // hey", e));
});

test("SingleDeclaration", t => {
  let e = setUp(t).expect("declare type", "struct hello");
  tearDown(split("struct hello;", e));
});

test("namespaceTree", t => {
  let e = setUp(t).expect("define namespace", {
    name: "namespace outside",
    code: " namespace inside {} "
  });

  e.once("define namespace", context => {
    e
      .expect("format")
      .expect("define namespace", { name: "namespace inside ", code: "" })
      .expect("format");

    split(context.code, e);
  });

  tearDown(split("namespace outside{ namespace inside {} }", e));
});

test("namespaceDeclaration", t => {
  let e = setUp(t).expect("define namespace", {
    name: "namespace outside",
    code: " struct hello; "
  });

  e.once("define namespace", context => {
    e.once("end", () => {
      e
        .expect("format")
        .expect("declare type", "struct hello")
        .expect("code block")
        .expect("end");
      split(context.code, e);
    });
  });
  tearDown(split("namespace outside{ struct hello; }", e));
});

test("NestedNamespaces", t => {
  let e = setUp(t)
    .expect("define namespace", {
      name: "namespace outside ",
      code: " namespace inside {} "
    })
    .once("define namespace", context => {
      e.expect("format");
      e.expect("define namespace", { name: "namespace inside ", code: "" });
      e.expect("format");
      split(context.code, e);
    });
  tearDown(split("namespace outside { namespace inside {} }", e));
});

test("DeclarationsAndDefinitions", t => {
  let e = setUp(t).expect("declare type", "struct hello");
  split("struct hello;", e);

  e.expect("define type", { name: "struct hello", code: "" });
  tearDown(split("struct hello{};", e));
});

test("NestedTypes", t => {
  let e = setUp(t).expect("define type", {
    name: "struct outside ",
    code: " struct inside {}; "
  });
  tearDown(split("struct outside { struct inside {}; };", e));
});

test("TypeWithFormat", t => {
  let e = setUp(t)
    .expect("define type", { name: "struct inside ", code: "" })
    .expect("format");

  tearDown(split("struct inside {}; ", e));
});

test("MemberFunctionDeclare", t => {
  let e = setUp(t);

  e.expect("define type");
  split("struct text{void member();};", e);

  e.expect("declare function", "void member()");
  tearDown(split("void member();", e));
});

test("FunctionDeclare", t => {
  let e = setUp(t).expect("declare function", "void foo()");
  tearDown(split("void foo();", e));
});

test("FunctionDefine", t => {
  let e = setUp(t).expect("define function", {
    name: "void foo() ",
    code: " hello "
  });
  tearDown(split("void foo() { hello }", e));
});

test("declareTypeAfterPreproesorDirective", t => {
  let e = setUp(t)
    .expect("preprocess")
    .expect("declare type", "struct bla");
  tearDown(split("#define hello asd\nstruct bla;", e));
});

test("declareTypeAfterPreproesorDirectives", t => {
  let e = setUp(t)
    .expect("preprocess")
    .repeat(1)
    .expect("declare type", "struct bla");
  tearDown(split("#define hello asd\n#define hello\\nasdfasd\nstruct bla;", e));
});

test("defineTypeAfterDeclareType", t => {
  let e = setUp(t)
    .expect("declare type", "struct jimmy")
    .expect("format")
    .expect("define type", { name: "struct hey ", code: " joe " })
    .expect("format");
  tearDown(split("struct jimmy; struct hey { joe } ", e));
});
