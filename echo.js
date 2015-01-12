#!/usr/bin/env node

var Analyzer = require( './src/analyzer' )
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
	var analyzer = new Analyzer( function( event, obj ) { 
		switch(event) {
			case 'declare type':
			case 'declare function': {
				output.write( obj + ';\n' );
				break;
			}
			case 'define type':
			case 'define namespace':
				output.write( obj.name + '{' + obj.code + '};\n' );
				break;
			case 'preprocess':
				output.write( '#' + obj );
				break;
		}
	}); 

	analyzer.split(content.toString());
});