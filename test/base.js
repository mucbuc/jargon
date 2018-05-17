let splitjs = require("./../src/split"),
  SeqExpector = require("expector").SeqExpector,
  Expector = require("expector").Expector,
  tapeTest = require("tape");

function split(code, emitter) {
  splitjs(code, (type, value) => {
    emitter.emit(type, value);
  });

  return emitter;
}

function splitCheck(code, emitter) {
  tearDown( split(code, emitter) );
}

function setUp(t) {
  return new SeqExpector(t);
}

function tearDown(fixture) {
  fixture.check();
}

function test(name, cb) {
  tapeTest(name, t => {
    cb(setUp(t));
  });
};

module.exports = {
  setUp,
  test : tapeTest,
  testN : test,
  tearDown,
  split,
  splitCheck
};
