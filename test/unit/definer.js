#!/usr/bin/env node

var assert = require("assert"),
  fluke = require("flukejs"),
  base = require("../base"),
  setUp = base.setUp,
  tearDown = base.tearDown,
  test = base.test,
  split = base.split;

test("defineNamespace", t => {
  let emitter = setUp(t);
  emitter
    .expect("define namespace", {
      name: "namespace hello ",
      code: " this is it "
    });

  split("namespace hello { this is it }", emitter);
  tearDown(emitter);
});

test("defineEmptyNamespace", t => {
  let emitter = setUp(t);
  emitter
    .expect("define namespace", { name: "namespace hello ", code: "" });

  split("namespace hello {}", emitter);
  tearDown(emitter);
});

test("defineTypeWithStatement", t => {
  let emitter = setUp(t);
  emitter
    .expect("define type", {
      name: "struct hello ",
      code: " unsigned world; "
    });

  split("struct hello { unsigned world; }", emitter);
  tearDown(emitter);
});

test("defineType", t => {
  let emitter = setUp(t);
  emitter
    .expect("define type", { name: "struct cya ", code: " yes" });

  split("struct cya { yes}", emitter);
  tearDown(emitter);
});

test("defineSubType", t => {
  let emitter = setUp(t);
  emitter.expect("define type", {
    name: "struct cya ",
    meta: " blu ",
    code: " yes "
  });

  tearDown(split("struct cya : blu { yes }", emitter));
});

test("defineFunction", t => {
  let emitter = setUp(t);
  emitter
    .expect("define function", { name: "void foo() ", code: " do something " });

  tearDown(split("void foo() { do something }", emitter));
});

test("dontDefineFunctionOnIf", t => {
  let emitter = setUp(t);
  emitter.expectNot("define function");

  tearDown(split("if(hello){what up now;}", emitter));
});

test("dontDefineFunctionOnSwitch", t => {
  let emitter = setUp(t);
  emitter.expectNot("define function");

  tearDown(split('switch(hello){case "what":}', emitter));
});

test("dontDefineFunctionOnFor", t => {
  let emitter = setUp(t).expectNot("define function");

  tearDown(split('for(hello, bye){case "what":}', emitter));
});

test("dontDefineFunctionOnWhile", t => {
  let emitter = setUp(t).expectNot("define function");

  tearDown(split('while(hello, bye){case "what":}', emitter));
});

test("dontDefineFunctionOnDo", t => {
  let emitter = setUp(t).expectNot("define function");

  tearDown(split('do(hello, bye){case "what":}', emitter));
});

test("defineMemberFunction", t => {
  let emitter = setUp(t)
    .expect("define function", {
      name: "hello::hello() -> returnType ",
      code: ""
    });

  tearDown(split("hello::hello() -> returnType {}", emitter));
});

test("defineConstructFunction", t => {
  let emitter = setUp(t)
    .expect("define function", {
      name: "hello::hello()",
      meta: " base() ",
      code: "bla bla"
    });

  tearDown(split("hello::hello() : base() {bla bla}", emitter));
});

test("defineConstructFunction", t => {
  let emitter = setUp(t)
    .expect("define function", {
      name: "hello::hello()",
      meta: " base() ",
      code: "bla bla"
    });
  
  tearDown(split("hello::hello() : base() {bla bla}", emitter));
});

test("defineEmptyNamespace", t => {
  let emitter = setUp(t)
    .expect("define namespace", { name: "namespace world", code: "" });

  tearDown(split("namespace world{}", emitter));
});

test("defineNamespaceWithWhite", t => {
  let emitter = setUp(t)
    .expect("define namespace", { name: "namespace   world ", code: "" });

  tearDown(split("namespace   world {}", emitter));
});
