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

  this.process = function( request, cb ) {
    
    assert( request.hasOwnProperty('resetStash') );

    var rules = { 'open': '<', 'close': '>' };
    var sub = new events.EventEmitter
      , scoper = new Scoper( rules ); 

    scoper.process( request, (type, content) => {
      cb( request.lhs + rules.open + content.trim() + rules.close );
    }); 


    //cb( request.lhs + request.token + request.rhs ); 

/*
    sub.on( 'open', function( req ) {
      

      scoper.process( req, function(type, content) {
        sub.emit( type, content );
      });
    } );

    //content += inner.lhs;

    sub.on( 'close', function(code) {
      cb( 'template parameters', code );
      request.consume( code.length );
      request.resetStash();
    } );

    sub.on( 'end', function( req ) {
      cb( 'template parameters', req.lhs );
      request.consume( req.lhs.length );
      request.resetStash();
    });
*/
    // fluke.splitAll( request.rhs, function( type, request) {
    //       sub.emit( type, request );
    //     }
    //   , rules
    // );


  };
}

module.exports = Template;
