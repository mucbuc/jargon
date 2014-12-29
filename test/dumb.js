#!/usr/bin/env node

var assert = require( 'assert' )
  , Expector = require( 'Expector' ).Expector
  , Analyzer = require( '../src/analyzer.js' )
  , fs = require( 'fs' );

assert( typeof Analyzer !== 'undefined' );
    
var data = fs.readFileSync( './test/samples/test.h' )
  , emitter = new Expector()
  , analyzer = new Analyzer( emitter );

emitter.setMaxListeners( 0 );

emitter
  .expect( 'preprocess' )
  .expect( 'declare type')
  .expect( 'declare function' )
  .expect( 'statement' )
  .expect( 'preprocess' )
  .expect( 'comment line' );

analyzer.split( data.toString() );

emitter.check(); 
