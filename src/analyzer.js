var assert = require( 'chai' ).assert
  , fluke = require( 'flukejs' )
  , events = require( 'events' )
  , Commenter = require( './commenter' )
  , Declarer = require( './declarer' )
  , Definer = require( './definer' )
  , Literalizer = require( './literalizer' )
  , Preprocessor = require( './preprocessor' )
  , Scoper = require( './scoper' );

assert( typeof Commenter === 'function' );
assert( typeof Declarer === 'function' );
assert( typeof Definer === 'function' );
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
    callback( 'end', obj );
  });

  emitter.on( 'declare type', function(obj) {
    callback( 'declare type', obj );
  });

  emitter.on( 'declare function', function(obj) {
    callback( 'declare function', obj );
  });

  emitter.on( 'comment line', function(obj) {
    callback( 'comment line', obj );
  });

  emitter.on( 'comment block', function(obj) {
    callback( 'comment block', obj );
  });

  emitter.on( 'define type', function(obj) {
    emitter.once( 'close', function(content) {
      obj.code = content;
      callback( 'define type', obj );
    });
  });

  emitter.on( 'define function', function(obj) {
    emitter.once( 'close', function(content) {
      obj.code = content;
      callback( 'define function', obj );
    });
  });

  emitter.on( 'define namespace', function(obj) {
    emitter.once( 'close', function(content) {
      obj.code = content;
      callback( 'define namespace', obj );
    });
  });

  emitter.on( 'preprocess', function(obj) {
    callback( 'preprocess', obj );
  });

  emitter.on( 'template parameters', function(obj) {
    callback( 'template parameters', obj );
  });

  emitter.on( 'code block', function(obj) {
    callback( 'code block', obj );
  });
}

module.exports = Analyzer;
