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

  this.process = ( request, cb ) => {
    
    assert( request.hasOwnProperty('resetStash') );

    const rules = { 'open': '<', 'close': '>' }
      , sub = new events.EventEmitter
      , scoper = new Scoper( rules ); 

    scoper.process( request, (type, content) => {
      cb( request.lhs + rules.open + content.trim() + rules.close );
    }); 
  };
}

module.exports = Template;
