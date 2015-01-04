#!/usr/bin/env node

function Formatter(emitter) {
	
	this.split = function(name, event) {
		var matches = name.match( /(\s*)(\w*)(\s*)/ );
		if (matches) {
			emitter.emit( 'formatting', matches[1] );
			emitter.emit( event, matches[2] );
			emitter.emit( 'formatting', matches[3] );
		}
	};
};

module.exports = Formatter; 