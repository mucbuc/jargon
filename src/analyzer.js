var assert = require( 'chai' ).assert
  , fluke = require( 'flukejs' )
  , events = require( 'events' )
  , Commenter = require( './commenter' )
  , Declarer = require( './declarer' )
  , Definer = require( './definer' )
  , Formatter = require( './formatter' )
  , Literalizer = require( './literalizer' )
  , Preprocessor = require( './preprocessor' )
  , Scoper = require( './scoper' );

assert( typeof Commenter === 'function' );
assert( typeof Declarer === 'function' );
assert( typeof Definer === 'function' );
assert( typeof Formatter === 'function' );
assert( typeof Literalizer === 'function' );
assert( typeof Preprocessor === 'function' );
assert( typeof Scoper === 'function' );

var Analyzer = function( callback ) {
  
  var rules = {
      'preprocess': '#',
      'comment line': '\\/\\/',
      'comment block': '\\/\\*',
      'open literal': '([^//]"|^")',
      'statement': ';',
      'open': '{'
    }
    , emitter = new events.EventEmitter()
    , definer = new Definer( emitter )
    , scoper = new Scoper( emitter )
	  , declarer = new Declarer( emitter )
    , formatter = new Formatter()
	  , preprocessor = new Preprocessor( emitter )
    , literalizer = new Literalizer( emitter )
    , commenter = new Commenter( emitter );

  this.split = function( code ) {
    fluke.splitAll( code, function( type, request ) {
        emitter.emit(type, request);
    }
    , rules );
  };

  forward( 'end' );
  forward( 'declare type' );
  forward( 'declare function' );
  forward( 'comment line' );
  forward( 'comment block' );
  forward( 'preprocess' );
  forward( 'template parameters' );
  forward( 'code block' );

  forwardContent('define type');
  forwardContent( 'define function' );
  forwardContent( 'define namespace' );

  function forwardContent( event ) {
    emitter.on( event, function(obj) {
      emitter.once( 'close', function(content) {
        obj.code = content;
        callback( event, obj );
      });
    });
  }

  function forward( event ) {
    emitter.on( event, function(obj) {
      callback( event, obj );
    });
  }
}

module.exports = Analyzer;
