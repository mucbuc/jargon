#!/usr/bin/env node

var util = require( 'util' )
  , events = require( 'events' );

function Formatter() {
	
	this.forward = function(event, info, cb) {
		cb(event, info);
	/*
		var matches = info.match( /(\s*)(\w*)(\s*)/ );
		if (matches) {
			if (matches[1].length) {
				cb( 'format', matches[1] );
			}
			cb( event, matches[2] );
			if (matches[3].length) {
				cb( 'format', matches[3] );
			}
		}
		*/
	};
};

util.inherits( Formatter, events.EventEmitter );

module.exports = Formatter; 