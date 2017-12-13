#!/usr/bin/env node

var input = ''
  , fs = require( 'fs' )
  , echo = require( './echo' )
  , test = require( 'tape' )
  , stream = require( 'stream' );

switch(process.argv.length) {
	case 3: 
		input = process.argv[2];
		break;
	default:
		console.log( 'usage: echo input_file [optional_output_file]' );
		process.exit( 1 );
		break;
};

function makeStream() {

	let content = '';
	return {

		getContent: function() {
			return content;
		},

		write: function(data) {
			content += data;
		}
	};
}

test( 'sanity', t => {

	fs.readFile( input, 'utf8', function(err, content){
		if (err) throw err;
		
		let output = makeStream();
		echo( content, output );

		t.equal( content, output.getContent() );
		t.end(); 
	});
});