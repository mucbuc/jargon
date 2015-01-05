#!/usr/bin/env node

var assert = require( 'assert' )
  , events = require( 'events' )
  , Formatter = require( '../src/formatter.js' );

assert( typeof Formatter === 'function' );

// suite( 'formatter', function() {
// 	test( 'basic', function() {
		var formatter = new Formatter();

		formatter.forward( 'ere', '\t \t \n hello', function(event, code) {
			console.log( event, new Buffer( code ) );
		} );
// 	} );
// });