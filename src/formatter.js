#!/usr/bin/env node

var assert = require( 'assert' )
  , util = require( 'util' )
  , events = require( 'events' );

function Formatter() {
  
  this.forward = function(event, info, cb) {

    if (typeof info === 'string') {
      if (match( info )) {
        return;
      }
    }
    cb( event, info );
    
    // else if (info.hasOwnProperty( 'name'))
    // {
    //   if (match(info.name)) {
    //     return;
    //   }
    //   cb( event, info.name );
    //   return;
    // }
    //

    function match( content ) {
      assert(typeof content === 'string');
    
      var matches = content.match( /(\s*)(\S*)(\s*)/ );
      if (matches) {
        if (matches[1].length) {
          cb( 'format', matches[1] );
        }
        cb( event, matches[2] );
        if (matches[3].length) {
          cb( 'format', matches[3] );
        }
        return true;
      }
      return false;
    }

  };

};

util.inherits( Formatter, events.EventEmitter );

module.exports = Formatter; 