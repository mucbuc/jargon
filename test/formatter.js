#!/usr/bin/env node

var assert = require( 'assert' )
  , Expector = require( 'expector' ).SeqExpector
  , Formatter = require( '../src/formatter.js' );

assert( typeof Formatter === 'function' );

suite( 'formatter', function() {
  test( 'headingSpaces', function() {
    var formatter = new Formatter()
      , controller = new Expector();

    controller
      .expect( 'format', '\t \t \n ' )
      .expect( 'ere', 'hello' )
      .expect( 'end' );

    formatter.forward( 'ere', '\t \t \n hello', function(event, code) {
      controller.emit( event, code ); 
    } );
  } );

  test( 'trailingSpaces', function() {
    var formatter = new Formatter()
      , controller = new Expector();

    controller
      .expect( 'ere', 'hello' )
      .expect( 'format', '\t \t \n ' )
      .expect( 'end' );
      
    formatter.forward( 'ere', 'hello\t \t', function(event, code) {
      controller.emit( event, code ); 
    } );
  });
});