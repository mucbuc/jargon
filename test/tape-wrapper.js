let Expector = require( 'expector' ).SeqExpector
  , test = require( 'tape' );

function setUp(t) {
  return new Expector(t); 
}

function tearDown(fixture) {
  fixture.check(fixture);
}

module.exports = {
	setUp,
	test, 
	tearDown
}