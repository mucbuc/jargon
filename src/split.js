var assert = require( 'chai' ).assert
  , fluke = require( 'flukejs' )
  , events = require( 'events' )
  , Commenter = require( './commenter' )
  , Declarer = require( './declarer' )
  , Definer = require( './definer' )
  , Formatter = require( './formatter' )
  , Literalizer = require( './literalizer' )
  , Preprocessor = require( './preprocessor' )
  , Template = require( './template');

assert( typeof Commenter === 'function' );
assert( typeof Declarer === 'function' );
assert( typeof Definer === 'function' );
assert( typeof Formatter === 'function' );
assert( typeof Literalizer === 'function' );
assert( typeof Preprocessor === 'function' );
assert( typeof Template === 'function' );

function split( code, callback ) {

  let rules = {
        'format': '^(\\s|\\t\\n)'
      }
    , emitter = new events.EventEmitter()
    , literalizer = new Literalizer()
    , templater = new Template()
    , preprocessor = new Preprocessor()
    , declarer = new Declarer()
    , definer = new Definer();

  mergeRules( literalizer.register(emitter, callback) );
  mergeRules( Commenter(emitter, callback) );
  mergeRules( preprocessor.register(emitter, callback) );
  mergeRules( definer.register(emitter, callback) );
  mergeRules( declarer.register(emitter, callback) );
  mergeRules( templater.register( emitter, callback ) );

  forwardContent( 'define type' );
  forwardContent( 'define function' );
  forwardContent( 'define namespace' );

  emitter.on( 'format', ( request ) => {
    callback( 'format', request.token ); 
  });
  
  fluke.splitAll( code, ( type, request ) => {
      emitter.emit( type, request );
    }
  , rules );
  
  function mergeRules(r) {
    rules = Object.assign( rules, r );
  }

  function forwardContent( event ) {
    emitter.on( event, obj => {
      emitter.once( 'close', content => {
        obj.code = content;
        callback( event, obj );
      });
    });
  }
}

module.exports = split;
