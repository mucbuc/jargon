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

  let rules = {
        'preprocess': '#',
        'comment line': '\\/\\/',
        'comment block': '\\/\\*',
        'open literal': '([^//]"|^")',
        'open template': '<',
        'statement': ';',
        'open': '{'
      }
    , emitter = new events.EventEmitter()
    , literalizer = new Literalizer()
    , commenter = new Commenter()
    , templater = new Template();

  forwardContent( 'define type' );
  forwardContent( 'define function' );
  forwardContent( 'define namespace' );

  emitter.on( 'open', ( request ) => {
    var definer = new Definer()
      , scoper = new Scoper();
    definer.process( request, ( type, content ) => {
      emitter.emit( type, content );
    });
    scoper.process(request, (type, content) => {
      emitter.emit( type, content );
    });    
  });

  emitter.on( 'statement', request => {
    declare( request );
  });  

  emitter.on( 'end', request => {
    declare( request );
  });

  emitter.on( 'preprocess', request => {
    var preprocessor = new Preprocessor(); 

    if (request.lhs.length && !request.lhs.match( /\S/ ))
    {
      callback( 'format', request.lhs );
    }
    
    preprocessor.preprocess( request, val => {
      callback( 'preprocess', val );
    });
  });

  emitter.on( 'comment line', request => {
    commenter.processLine( request, comment => {
      callback( 'comment', '\/\/' + comment + '\n' );
    });
  }); 

  emitter.on( 'comment block', request => {
    commenter.processBlock( request, comment => {
      callback( 'comment', '/*' + comment );
    });
  });

  emitter.on( 'open template', request => {
    templater.process( request, templateParams => {
      callback( 'template parameters', templateParams );
    });
  });

  fluke.splitAll( code, ( type, request ) => {
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
        let formatter = new Formatter();
        formatter.forward(event, obj, callback);
      break;
    }
  }

  function declare( req ) {
    let declarer = new Declarer();
    declarer.process( req, ( event, obj ) => {
      format(event, obj );
    });
  }

  function forwardContent( event ) {
    emitter.on( event, obj => {
      emitter.once( 'close', content => {
        obj.code = content;
        format(event, obj);
      });
    });
  }
}

module.exports = split;
