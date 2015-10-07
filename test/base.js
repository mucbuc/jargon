var assert = require( 'chai' ).assert
  , Expector = require( 'expector' ).Expector
  , SeqExpector = require( 'expector' ).SeqExpector
  , tapeTest = require( 'tape' );

function test(name, foo) {
  tapeTest(name, function(t) {
    var emitter = new Expector(t);
    foo(emitter);
    emitter.check();
    delete emitter;
    t.end();
  });
}

function testSequence(name, foo) {
  tapeTest(name, function(t) {
    var emitter = new SeqExpector(t);
    foo(emitter);
    emitter.check();
    delete emitter;
    t.end();
  });
}

module.exports = {
  test: test,
  testSequence: testSequence
};