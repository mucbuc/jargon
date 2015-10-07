var assert = require( 'chai' ).assert
  , Expector = require( 'expector' ).SeqExpector
  , tapeTest = require( 'tape' );

function test(name, foo) {
  tapeTest(name, function(t) {
    var emitter = new Expector(t);
    foo(emitter);
    emitter.check();
    delete emitter;
  });
}

module.exports = test;