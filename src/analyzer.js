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
    , definer = new Definer()
    , scoper = new Scoper()
	  , declarer = new Declarer()
    , formatter = new Formatter()
	  , preprocessor = new Preprocessor() 
    , literalizer = new Literalizer()
    , commenter = new Commenter();

  this.split = function( code ) {
    fluke.splitAll( code, function( type, request ) {
      emitter.emit( type, request );
    }
    , rules );
  };

  forward( 'end' );
  forward( 'comment line' );
  forward( 'comment block' );
  forward( 'template parameters' );
  forward( 'code block' );
  forwardContent( 'define type' );
  forwardContent( 'define function' );
  forwardContent( 'define namespace' );
  
  emitter.on( 'open', function( request ) {
    definer.process( request, function( type, content ) {
      emitter.emit( type, content );
    });
    scoper.process(request, function(type, content) {
      emitter.emit( type, content );
    });    
  });

  emitter.on( 'statement', function( request ) {
    declare( request );
  });  

  emitter.on( 'end', function( request ) {
    declare( request );
  });

  emitter.on( 'preprocess', function( request ) {
    preprocessor.preprocess( request, function( val ) {
      callback( 'preprocess', val );
    });
  });

  function format(event, obj) {
    formatter.forward(event, obj, callback);
  }

  function declare( req ) {
    declarer.process( req, function( event, obj ) {
      format(event, obj);
    });
  }

  function forwardContent( event ) {
    emitter.on( event, function(obj) {
      emitter.once( 'close', function(content) {
        obj.code = content;
        format(event, obj);
      });
    });
  }

  function forward( event ) {
    emitter.on( event, function(obj) {
      format(event, obj);
    });
  }
};

module.exports = Analyzer;
