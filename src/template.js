/*
  note: Template doesn't listen for 'end' event ==> this should generate an error since
        templates are always declarations or definitions
*/

var assert = require( 'assert' )
  , fluke = require( 'flukejs' )
  , Scoper = require( './scoper' )
  , events = require( 'events' );

assert( typeof Scoper !== 'undefined' );

function Template() {

  this.process = function( response, cb ) {
    var rules = { 'open': '<', 'close': '>' };
    var sub = new events.EventEmitter
      , scoper = new Scoper( rules );

    sub.on( 'open', function( req ) {
      scoper.process( req, function(type, content) {
        sub.emit( type, content );
      });
    } );

    sub.on( 'close', function(code) {
      cb( 'template parameters', code );
    } );

    sub.on( 'end', function( response ) {
      cb( 'template parameters', response.lhs );
    });

    fluke.splitAll( response.lhs, function( type, response) {
          sub.emit( type, response );
        }
      , rules
    );
  };
}

module.exports = Template;
