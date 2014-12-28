#!/usr/bin/env node

var assert = require( 'assert' )
  , Expector = require( 'Expector' ).Expector
  , Analyzer = require( '../src/analyzer.js' )
  , fs = require( 'fs' );

assert( typeof Analyzer !== 'undefined' );
    
suite( "unit", function() {

  var emitter;
  setup(function() {
    emitter = new Expector;
    emitter.setMaxListeners( 0 );
  });

  teardown(function() {
    emitter.check(); 
    delete emitter;
  }); 

  test( "read test.h", function() {
    var data = fs.readFileSync( './test/samples/test.h' )
      , analyzer = new Analyzer( emitter );
    emitter
      .expect( 'preprocess' )
      .expect( 'declare type' )
      .expect( 'preprocess' )
      .expect( 'comment line' );
    analyzer.split( data.toString() );
  });
}); 