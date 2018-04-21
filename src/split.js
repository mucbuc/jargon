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
  , Template = require( './template')
  , regexMap = require( './regexmap' );

assert( typeof Commenter === 'function' );
assert( typeof Declarer === 'function' );
assert( typeof Definer === 'function' );
assert( typeof Formatter === 'function' );
assert( typeof Literalizer === 'function' );
assert( typeof Preprocessor === 'function' );
assert( typeof Scoper === 'function' );
assert( typeof Template === 'function' );
assert( typeof regexMap !== 'undefined' );

function split( code, callback ) {

  let rules = {
        'statement': ';',
        'open': '{',
        'format': '^(\\s|\\t\\n)'
      }
    , emitter = new events.EventEmitter()
    , literalizer = new Literalizer()
    , commenter = new Commenter()
    , templater = new Template()
    , preprocessor = new Preprocessor();

  rules = Object.assign( {}, rules, literalizer.register(emitter, callback) );
  rules = Object.assign( {}, rules, commenter.register(emitter, callback) );
  rules = Object.assign( {}, rules, preprocessor.register(emitter, callback) );

  forwardContent( 'define type' );
  forwardContent( 'define function' );
  forwardContent( 'define namespace' );

  emitter.on( 'format', ( request ) => {
    callback( 'format', request.token ); 
  });

  emitter.on( 'open', ( request ) => {
    let definer = new Definer()
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

  rules = Object.assign( {}, rules, templater.register( emitter, callback ) );
  
  fluke.splitAll( code, ( type, request ) => {
      emitter.emit( type, request );
    }
  , rules );
  
  function declare( req ) {
    let declarer = new Declarer();
    declarer.process( req, ( event, obj ) => {
      let formatter = new Formatter();
      formatter.forward(event, obj, callback);
    });
  }

  function forwardContent( event ) {
    emitter.on( event, obj => {
      emitter.once( 'close', content => {
        obj.code = content;
        let formatter = new Formatter();
        formatter.forward(event, obj, callback);
      });
    });
  }
}

module.exports = split;
