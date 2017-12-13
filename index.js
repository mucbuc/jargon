#!/usr/bin/env node

var input = ''
  , output = process.stdout
  , fs = require( 'fs' )
  , echo = require( './echo' );

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

fs.readFile( input, 'utf8', function(err, content){
	if (err) throw err;
	echo( content, output );
});
