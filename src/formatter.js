#!/usr/bin/env node

const assert = require( 'assert' )
  , util = require( 'util' )
  , events = require( 'events' );

function format(event, info, cb) {

  if (typeof info === 'string') {
    if (match( info )) {
      return;
    }
  }
  cb( event, info );

  function match( content ) {
    assert(typeof content === 'string');
  
    let matches = content.match( /^(\s*)(.*?)(\s*)$/m );
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

module.exports = format; 