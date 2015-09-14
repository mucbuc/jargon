var assert = require( 'chai' ).assert
  , Expector = require( 'expector' ).SeqExpector
  , tapeTest = require( 'tape' );

function test(name, foo) {
  tapeTest(name, function(t) {
    var emitter = new Expector;
    foo(emitter);
    emitter.check();
    delete emitter;
    t.pass();
    t.end();
  });
}

module.exports = test;