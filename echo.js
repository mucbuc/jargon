#!/usr/bin/env node

var split = require( './src/split' )
  , events = require( 'events' )
  , input = ''
  , output = process.stdout
  , controller = new events.EventEmitter()
  , fs = require( 'fs' )
  , util = require( 'util' );

switch(process.argv.length) {
	case 4: 
		output = fs.createWriteStream( process.argv[3] );
	case 3: 
		input = process.argv[2];
		break;
	default:
		console.log( 'usage: echo input_file [optional_output_file]' );
		process.exit( 1 );
		break;
};

fs.readFile( input, function(err, content){
	if (err) throw err;
	split(content.toString(), function( event, obj ) { 
		switch(event) {
			case 'declare type':
			case 'declare function': {
				output.write( obj + ';' );
				break;
			}
			case 'define type':
				output.write( obj.name + '{' + obj.code + '};' );
				break;
			case 'define namespace':
			case 'define function':
				output.write( obj.name + '{' + obj.code + '}' );
				break;
			case 'preprocess':
				output.write( '#' + obj );
				break;
			case 'code line':
			case 'format': 
			case 'comment':
				output.write( obj );
				break;
			case 'preprocess':
				output.write( '#' + obj );
				break;
		}
	}); 
});