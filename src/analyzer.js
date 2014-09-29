var assert = require( 'chai' ).assert
  , fluke = require( 'flukejs' )
  , Scoper = require( './scoper' )
  , Declarer = require( './declarer' )
  , Definer = require( './definer' )
  , Preprocessor = require( './preprocessor' )
  , Commenter = require( './commenter' )
  , Literalizer = require( './literalizer' );

assert( typeof Scoper === 'function' );
assert( typeof Declarer === 'function' );
assert( typeof Definer === 'function' );
assert( typeof Preprocessor === 'function' );
assert( typeof Literalizer === 'function' );
assert( typeof Commenter === 'function' );

var Analyzer = function( emitter ) {
  
  var rules = {
      'preprocess': '#',
      'comment line': '\\/\\/',
      'comment block': '\\/\\*',
      'open literal': '([^//]"|^")',
      'statement': ';',
      'open': '{',
      'close': '}'
    }
    , scoper = new Scoper( emitter, rules )
	  , declarer = new Declarer( emitter )
	  , definer = new Definer( emitter )
	  , preprocessor = new Preprocessor( emitter )
    , literalizer = new Literalizer( emitter )
    , commenter = new Commenter( emitter );

  this.split = function( code ) {
    fluke.splitAll( code, function( type, request ) {
        emitter.emit(type, request);
    }
    , rules );
  };
}; 

module.exports = Analyzer;
