#!/usr/bin/env node

var assert = require( 'assert' )
  , Expector = require( 'Expector' ).Expector
  , Analyzer = require( '../src/analyzer.js' )
  , fs = require( 'fs' );

assert( typeof Analyzer !== 'undefined' );
    
//test.only( "unit",  function() {

  var emitter;
 // setup(function() {
    emitter = new Expector;
    emitter.setMaxListeners( 0 );
 // });



  //test( "read test.h", function() {
    var data = fs.readFileSync( './test/samples/test.h' )
      , analyzer = new Analyzer( emitter );
    emitter
      .expect( 'open' )
      .expect( 'open scope' )
      .expect( 'define namespace', { name: 'namespace hello', code: '' } )
      .expect( 'end' )
      .expect( 'preprocess' )
      .expect( 'declare type' )
      .expect( 'preprocess' )
      .expect( 'comment line' );
    analyzer.split( data.toString() );
  //});


  //teardown(function() {
    emitter.check(); 
    delete emitter;
  //}); 
//}); 