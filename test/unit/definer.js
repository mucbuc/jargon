#!/usr/bin/env node

var assert = require("assert"),
  fluke = require("flukejs"),
  base = require("../base"),
  setUp = base.setUp,
  tearDown = base.tearDown,
  test = base.test,
  split = base.split
  splitCheck = base.splitCheck;

test("defineNamespace", t => {
  let emitter = setUp(t)
    .expect("define namespace", {
      name: "namespace hello ",
      code: " this is it "
    });
  splitCheck("namespace hello { this is it }", emitter);
});

test("defineEmptyNamespace", t => {
  let emitter = setUp(t)
    .expect("define namespace", { name: "namespace hello ", code: "" });

  splitCheck("namespace hello {}", emitter);
});

test("defineTypeWithStatement", t => {
  let emitter = setUp(t)
    .expect("define type", {
      name: "struct hello ",
      code: " unsigned world; "
    });

  splitCheck("struct hello { unsigned world; }", emitter);
});

test("defineType", t => {
  let emitter = setUp(t)
    .expect("define type", { name: "struct cya ", code: " yes" });

  splitCheck("struct cya { yes}", emitter);
});

test("defineSubType", t => {
  let emitter = setUp(t)
    .expect("define type", {
      name: "struct cya ",
      meta: " blu ",
      code: " yes "
  });

  splitCheck("struct cya : blu { yes }", emitter);
});

test("defineFunction", t => {
  let emitter = setUp(t)
    .expect("define function", { name: "void foo() ", code: " do something " });

  splitCheck("void foo() { do something }", emitter);
});

test("dontDefineFunctionOnIf", t => {
  let emitter = setUp(t).expectNot("define function");
  splitCheck("if(hello){what up now;}", emitter);
});

test("dontDefineFunctionOnSwitch", t => {
  let emitter = setUp(t).expectNot("define function");
  splitCheck('switch(hello){case "what":}', emitter);
});

test("dontDefineFunctionOnFor", t => {
  let emitter = setUp(t).expectNot("define function");
  splitCheck('for(hello, bye){case "what":}', emitter);
});

test("dontDefineFunctionOnWhile", t => {
  let emitter = setUp(t).expectNot("define function");
  splitCheck('while(hello, bye){case "what":}', emitter);
});

test("dontDefineFunctionOnDo", t => {
  let emitter = setUp(t).expectNot("define function");
  splitCheck('do(hello, bye){case "what":}', emitter);
});

test("defineMemberFunction", t => {
  let emitter = setUp(t)
    .expect("define function", {
      name: "hello::hello() -> returnType ",
      code: ""
    });

  splitCheck("hello::hello() -> returnType {}", emitter);
});

test("defineConstructFunction", t => {
  let emitter = setUp(t)
    .expect("define function", {
      name: "hello::hello()",
      meta: " base() ",
      code: "bla bla"
    });

  splitCheck("hello::hello() : base() {bla bla}", emitter);
});

test("defineConstructFunction", t => {
  let emitter = setUp(t)
    .expect("define function", {
      name: "hello::hello()",
      meta: " base() ",
      code: "bla bla"
    });
  
  splitCheck("hello::hello() : base() {bla bla}", emitter);
});

test("defineEmptyNamespace", t => {
  let emitter = setUp(t)
    .expect("define namespace", { name: "namespace world", code: "" });

  splitCheck("namespace world{}", emitter);
});

test("defineNamespaceWithWhite", t => {
  let emitter = setUp(t)
    .expect("define namespace", { name: "namespace   world ", code: "" });

  splitCheck("namespace   world {}", emitter);
});
