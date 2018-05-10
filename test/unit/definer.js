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
    .expectNot("define type")
    .expectNot("define function")
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
    .expectNot("define type")
    .expectNot("define function")
    .expect("define namespace", { name: "namespace hello ", code: "" });

  split("namespace hello {}", emitter);
  tearDown(emitter);
});

test("defineTypeWithStatement", t => {
  let emitter = setUp(t);
  emitter
    .expectNot("define namespace")
    .expectNot("define function")
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
    .expectNot("define namespace")
    .expectNot("define function")
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

  split("struct cya : blu { yes }", emitter);
  tearDown(emitter);
});

test("defineFunction", t => {
  let emitter = setUp(t);
  emitter
    .expectNot("define namespace")
    .expectNot("define type")
    .expect("define function", { name: "void foo() ", code: " do something " });

  split("void foo() { do something }", emitter);
  tearDown(emitter);
});

test("dontDefineFunctionOnIf", t => {
  let emitter = setUp(t);
  emitter.expectNot("define function");

  split("if(hello){what up now;}", emitter);
  tearDown(emitter);
});

test("dontDefineFunctionOnSwitch", t => {
  let emitter = setUp(t);
  emitter.expectNot("define function");

  split('switch(hello){case "what":}', emitter);
  tearDown(emitter);
});

test("dontDefineFunctionOnFor", t => {
  let emitter = setUp(t);
  emitter.expectNot("define function");

  split('for(hello, bye){case "what":}', emitter);
  tearDown(emitter);
});

test("dontDefineFunctionOnWhile", t => {
  let emitter = setUp(t);
  emitter.expectNot("define function");

  split('while(hello, bye){case "what":}', emitter);
  tearDown(emitter);
});

test("dontDefineFunctionOnDo", t => {
  let emitter = setUp(t);
  emitter.expectNot("define function");

  split('do(hello, bye){case "what":}', emitter);
  tearDown(emitter);
});

test("defineMemberFunction", t => {
  let emitter = setUp(t);
  emitter
    .expectNot("define namespace")
    .expectNot("define type")
    .expect("define function", {
      name: "hello::hello() -> returnType ",
      code: ""
    });

  split("hello::hello() -> returnType {}", emitter);
  tearDown(emitter);
});

test("defineConstructFunction", t => {
  let emitter = setUp(t);
  emitter
    .expectNot("define namespace")
    .expectNot("define type")
    .expect("define function", {
      name: "hello::hello()",
      meta: " base() ",
      code: "bla bla"
    });

  split("hello::hello() : base() {bla bla}", emitter);
  tearDown(emitter);
});

test("defineConstructFunction", t => {
  let emitter = setUp(t);
  emitter
    .expectNot("define namespace")
    .expectNot("define type")
    .expect("define function", {
      name: "hello::hello()",
      meta: " base() ",
      code: "bla bla"
    });

  split("hello::hello() : base() {bla bla}", emitter);
  tearDown(emitter);
});

test("defineEmptyNamespace", t => {
  let emitter = setUp(t);
  emitter
    .expectNot("define type")
    .expectNot("define function")
    .expect("define namespace", { name: "namespace world", code: "" });

  split("namespace world{}", emitter);
  tearDown(emitter);
});

test("defineNamespaceWithWhite", t => {
  let emitter = setUp(t);
  emitter
    .expectNot("define type")
    .expectNot("define function")
    .expect("define namespace", { name: "namespace   world ", code: "" });

  split("namespace   world {}", emitter);

  tearDown(emitter);
});
