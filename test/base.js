let splitjs = require("./../src/split"),
  SeqExpector = require("expector").SeqExpector,
  Expector = require("expector").Expector,
  test = require("tape");

function split(code, emitter) {
  splitjs(code, (type, value) => {
    emitter.emit(type, value);
  });
}

function setUp(t) {
  return new SeqExpector(t);
}

function setUpU(t) {
  return new Expector(t);
}

function tearDown(fixture) {
  fixture.check(fixture);
}

module.exports = {
  setUp,
  setUpU,
  test,
  tearDown, 
  split
};
