#!/usr/bin/env node

var util = require( 'util' )
  , events = require( 'events' );

function Formatter() {
	
	this.forward = function(event, info, cb) {

		if (typeof info === 'string') {
			var matches = info.match( /(\s*)(.*)(\s*?)/ );
			if (matches) {
				if (matches[1].length) {
					cb( 'format', matches[1] );
				}
				cb( event, matches[2] );
				if (matches[3].length) {
					cb( 'format', matches[3] );
				}
				return;
			}
		}
		cb( event, info );
	};
};

util.inherits( Formatter, events.EventEmitter );

module.exports = Formatter; 