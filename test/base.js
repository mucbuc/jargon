var assert = require( 'chai' ).assert
  , Expector = require( 'expector' ).Expector
  , SeqExpector = require( 'expector' ).SeqExpector
  , tapeTest = require( 'tape' );

function test(name, foo) {
  makeTester(name, foo, Expector);
}

function testSequence(name, foo) {
  makeTester(name, foo, SeqExpector);
}

function makeTester(name, foo, Type) {
  tapeTest(name, function(t) {
    var emitter = new Type(t);
    foo(emitter);
    emitter.check();
    delete emitter;
  });
}

module.exports = {
  test: test,
  testSequence: testSequence
};