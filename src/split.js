var assert = require( 'chai' ).assert
  , fluke = require( 'flukejs' )
  , events = require( 'events' )
  , Commenter = require( './commenter' )
  , Declarer = require( './declarer' )
  , Definer = require( './definer' )
  , Formatter = require( './formatter' )
  , Literalizer = require( './literalizer' )
  , Preprocessor = require( './preprocessor' )
  , Template = require( './template')
  , regexMap = require( './regexmap' );

assert( typeof Commenter === 'function' );
assert( typeof Declarer === 'function' );
assert( typeof Definer === 'function' );
assert( typeof Formatter === 'function' );
assert( typeof Literalizer === 'function' );
assert( typeof Preprocessor === 'function' );
assert( typeof Template === 'function' );
assert( typeof regexMap !== 'undefined' );

function split( code, callback ) {

  let rules = {
        'format': '^(\\s|\\t\\n)'
      }
    , emitter = new events.EventEmitter()
    , literalizer = new Literalizer()
    , commenter = new Commenter()
    , templater = new Template()
    , preprocessor = new Preprocessor()
    , declarer = new Declarer()
    , definer = new Definer();

  rules = Object.assign( {}, rules, literalizer.register(emitter, callback) );
  rules = Object.assign( {}, rules, commenter.register(emitter, callback) );
  rules = Object.assign( {}, rules, preprocessor.register(emitter, callback) );

  forwardContent( 'define type' );
  forwardContent( 'define function' );
  forwardContent( 'define namespace' );

  emitter.on( 'format', ( request ) => {
    callback( 'format', request.token ); 
  });

  rules = Object.assign( {}, rules, definer.register(emitter, callback) );
  rules = Object.assign( {}, rules, declarer.register(emitter, callback) );
  rules = Object.assign( {}, rules, templater.register( emitter, callback ) );
  
  fluke.splitAll( code, ( type, request ) => {
      emitter.emit( type, request );
    }
  , rules );
  
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
