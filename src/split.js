var assert = require( 'chai' ).assert
  , fluke = require( 'flukejs' )
  , events = require( 'events' )
  , Commenter = require( './commenter' )
  , Declarer = require( './declarer' )
  , Definer = require( './definer' )
  , Formatter = require( './formatter' )
  , Literalizer = require( './literalizer' )
  , Preprocessor = require( './preprocessor' )
  , Scoper = require( './scoper' )
  , Template = require( './template');

assert( typeof Commenter === 'function' );
assert( typeof Declarer === 'function' );
assert( typeof Definer === 'function' );
assert( typeof Formatter === 'function' );
assert( typeof Literalizer === 'function' );
assert( typeof Preprocessor === 'function' );
assert( typeof Scoper === 'function' );
assert( typeof Template === 'function' );

function split( code, callback ) {

  var rules = {
        'preprocess': '#',
        'comment line': '\\/\\/',
        'comment block': '\\/\\*',
        'open literal': '([^//]"|^")',
        //'open template': '<',
        'statement': ';',
        'open': '{'
      }
    , emitter = new events.EventEmitter()
    , literalizer = new Literalizer()
    , commenter = new Commenter();

  forwardContent( 'define type' );
  forwardContent( 'define function' );
  forwardContent( 'define namespace' );

  emitter.on( 'open', function( request ) {
    var definer = new Definer()
      , scoper = new Scoper();
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
    var preprocessor = new Preprocessor(); 

    if (request.lhs.length && !request.lhs.match( /\S/ ))
    {
      callback( 'format', request.lhs );
    }
    
    preprocessor.preprocess( request, function( val ) {
      callback( 'preprocess', val );
    });
  });

  emitter.on( 'comment line', function( request ) {
    commenter.processLine( request, function(comment) {
      callback( 'comment', '\/\/' + comment + '\n' );
    });
  }); 

  emitter.on( 'comment block', function( request ) {
    commenter.processBlock( request, function(comment) {
      callback( 'comment', '/*' + comment );
    });
  });

  fluke.splitAll( code, function( type, request ) {
      emitter.emit( type, request );
    }
  , rules );
  
  function format(event, obj) {

    switch (event) {
      case 'code line':
        if (!obj.match( /\S/ )) {
          callback( 'format', obj );
        }
        else {
          callback( 'code line', obj + ';' );
        }
        break;
      default:
        var formatter = new Formatter();
        formatter.forward(event, obj, callback);
      break;
    }
  }

  function declare( req ) {
    var declarer = new Declarer();
    declarer.process( req, function( event, obj ) {
      format(event, obj );
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
}

module.exports = split;
