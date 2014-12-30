#!/usr/bin/env node

var assert = require( 'chai' ).assert
  , fs = require( 'fs' )
  , Analyzer = require( '../src/analyzer' )
  , Expector = require( 'expector' ).Expector;

assert( typeof Analyzer === 'function' );

suite( 'analyzer', function(){

  var emitter;

  setup(function() {
      emitter = new Expector;
      emitter.setMaxListeners( 0 );
  });
  
  teardown(function() {
    emitter.check(); 
    delete emitter;
  }); 
  
  test( 'readSampleFile', function() {

    emitter
      .expect( 'preprocess' )
      .expect( 'declare type')
      .expect( 'declare function' )
      .expect( 'define type' )
      .expect( 'define function' )
      .expect( 'preprocess')
      .expect( 'define namespace' )
      .expect( 'comment block' )
      .expect( 'preprocess' )
      .expect( 'comment line' );
    split( fs.readFileSync( './test/samples/test.h' ).toString() );     
  });

  test( 'PreprocessFollowedByComment', function() {
    emitter
      .expect( 'preprocess' )
      .expect( 'comment line' );
    split( '#define SOB 1 \/\/ hey\n' );
  });

  test( 'SingleDeclaration', function() {
    emitter.expect( 'declare type', 'struct hello' );
    split( 'struct hello;' );  
  });

  test( 'namespaceTree', function() {
    emitter
      .expect( 'define namespace', { name: 'namespace outside', code: ' namespace inside {} ' } )
      .expect( 'end' ); 

    emitter.once( 'define namespace', function( context ) {
      emitter.once( 'end', function() {
        emitter
          .expect( 'define namespace', { name: ' namespace inside ', code: '' } )
          .expect( 'end' );

        split( context.code );
      } ); 
    } );

    split( 'namespace outside{ namespace inside {} }' );
  }); 

  test( 'namespaceDeclaration', function() {
    emitter
      .expect( 'define namespace', { name: 'namespace outside', code: ' struct hello; ' } )
      .expect( 'end' ); 

    emitter.once( 'define namespace', function( context ) {
      emitter.once( 'end', function() {
        emitter.expect( 'declare type', 'struct hello' );
        split( context.code );
      } ); 
    } ); 

    split( 'namespace outside{ struct hello; }' );
  });

  test( 'NestedNamespaces', function() {
    emitter.expect( 'define namespace', { name: 'namespace outside ', code: ' namespace inside {} ' } )
      .once( 'define namespace', function( context ) {
      emitter.once( 'end', function() {
        emitter.expect( 'define namespace', { name: ' namespace inside ', code: '' } );
        split( context.code );
      } ); 
    } ); 
    
    split( 'namespace outside { namespace inside {} }' );  
  });

  test( 'DeclarationsAndDefinitions', function() {
    emitter.expect( 'declare type', 'struct hello' ); 
    split( 'struct hello;' );

    emitter.expect( 'define type', { name: 'struct hello', code: '' } ); 
    split( 'struct hello{};' );
  });

  test( 'NestedTypes', function() {
    
    emitter.expect( 'define type', { name: 'struct outside ', code: ' struct inside {}; ' } );

    emitter.once( 'define type', function( context ) {
      emitter.expect( 'define type', { name: ' struct inside ', code: '' });
      split( context.code );
    } );  

    split( 'struct outside { struct inside {}; };');
  });

  test( 'FunctionDeclare', function() {
    emitter.expect( 'declare function', 'void foo()' );
    split( 'void foo();' );
  });

  test( 'FunctonDefine', function() {
    emitter.expect( 'define function', { name: 'void foo() ', code: ' hello ' } ); 
    split( 'void foo() { hello }' );
  });

  test( 'MemberFunctionDeclare', function() {
    emitter.expect( 'define type' ); 
    emitter.once( 'define type', function( context ) {
      emitter.expect( 'declare function', 'void member()' ); 
      split( context.code ); 
    } ); 

    split( 'struct text{void member();};' );
  }); 

  test( 'declareTypeAfterPreproesorDirective', function() {
    emitter
      .expect( 'preprocess' )
      .expect( 'declare type', 'struct bla' );
    split( '#define hello asd\nstruct bla;' );
  });

  test( 'declareTypeAfterPreproesorDirectives', function() {
    emitter
      .expect( 'preprocess' )
      .expect( 'declare type', 'struct bla' );
    split( '#define hello asd\n#define hello\\nasdfasd\nstruct bla;' );
  });

  test( 'defineTypeAfterDeclareType', function () {
    emitter
      .expect( 'declare type', ' struct jimmy ' )  
      .expect( 'define type', { name: ' struct hey ', code: ' joe ' } );
    split( 'struct jimmy; struct hey { joe }' );
  });

  function split( code ) {
      var analyzer = new Analyzer( emitter );
      analyzer.split( code ); 
  }

});
