var assert = require( 'chai' ).assert
  , fluke = require( 'flukejs' )
  , Commenter = require( './commenter' )
  , Declarer = require( './declarer' )
  , Definer = require( './definer' )
  , Literalizer = require( './literalizer' )
  , Preprocessor = require( './preprocessor' )
  , Scoper = require( './scoper' )
  , events = require( 'events' );

assert( typeof Scoper === 'function' );
assert( typeof Declarer === 'function' );
assert( typeof Definer === 'function' );
assert( typeof Preprocessor === 'function' );
assert( typeof Literalizer === 'function' );
assert( typeof Commenter === 'function' );

var Analyzer = function( out ) {
  
  var rules = {
      'preprocess': '#',
      'comment line': '\\/\\/',
      'comment block': '\\/\\*',
      'open literal': '([^//]"|^")',
      'statement': ';',
      'open': '{',
      'close': '}'
    }
    , emitter = new events.EventEmitter()
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

  emitter.on( 'end', function(obj) {
    out.emit( 'end', obj );
  });

  emitter.on( 'declare type', function(obj) {
    out.emit( 'declare type', obj );
  });

  emitter.on( 'declare function', function(obj) {
    out.emit( 'declare function', obj );
  });

  emitter.on( 'comment line', function(obj) {
    out.emit( 'comment line', obj );
  });

  emitter.on( 'comment block', function(obj) {
    out.emit( 'comment block', obj );
  });

  emitter.on( 'define type', function(obj) {
    out.emit( 'define type', obj );
  });

  emitter.on( 'define function', function(obj) {
    out.emit( 'define function', obj );
  });

  emitter.on( 'define namespace', function(obj) {
    out.emit( 'define namespace', obj );
  });

  emitter.on( 'preprocess', function(obj) {
    out.emit( 'preprocess', obj );
  });

  emitter.on( 'template parameters', function(obj) {
    out.emit( 'template parameters', obj );
  });
}

module.exports = Analyzer;
