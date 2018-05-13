let splitjs = require("./../src/split"),
  SeqExpector = require("expector").SeqExpector,
  Expector = require("expector").Expector,
  test = require("tape");

function split(code, emitter) {
  splitjs(code, (type, value) => {
    emitter.emit(type, value);
  });

  return emitter;
}

function setUp(t) {
  return new SeqExpector(t);
}

function tearDown(fixture) {
  fixture.check(fixture);
}

module.exports = {
  setUp,
  test,
  tearDown,
  split
};
