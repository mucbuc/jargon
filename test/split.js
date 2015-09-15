#!/usr/bin/env node

var assert = require( 'chai' ).assert
  , fs = require( 'fs' )
  , jargonSplit = require( '../src/split' )
  , test = require( './base.js' );

assert( typeof jargonSplit === 'function' );

test( 'commentBlockPreprocessor', function(emitter) {
  emitter
    .expect( 'comment' )
    .expect( 'preprocess' );

  split( '/**/#endif', emitter );
});

test( 'commentBlockFormatPreprocessor', function(emitter) {
  emitter
    .expect( 'comment' )
    .expect( 'format' )
    .expect( 'preprocess' );

  split( '/**/ #endif', emitter );
});

test( 'readSampleFile', function(emitter) {
  emitter
    .expect( 'preprocess' )
    .expect( 'declare type' )
    .expect( 'format' )
    .expect( 'declare function' )
    .expect( 'code line' )
    .expect( 'define type', { 
      name: '\nstruct hello\n', 
      code: '\n\tint hello;\n\tvoid bye();\n' 
    })
    .expect( 'define function', {
      name: '\n\nvoid hello() \n', 
      code: '\n\n'
    })
    .expect( 'format' )
    .expect( 'preprocess' )
    .expect( 'define namespace', {
      name: '\nnamespace hello \n', 
      code: '\n\tfdsa;jlsjk\n\t;kjdsafl;lj\n\t;klj\n'
    } )
    .expect( 'comment' )
    .expect( 'format' )
    .expect( 'preprocess' )
    .expect( 'comment' );

  split( fs.readFileSync( './test/samples/test.h' ).toString(), emitter );     
});

test( 'PreprocessFollowedByBlockComment', function(emitter) {
  emitter
    .expect( 'preprocess' )
    .expect( 'comment' );
  split( '#define SOB 1 \/* hey *\/', emitter );
});

test( 'PreprocessFollowedByLineComment', function(emitter) {
  emitter
    .expect( 'preprocess' )
    .expect( 'comment' )
    .expect( 'format' );
  split( '#define SOB 1 \/\/ hey\n', emitter );
});

test( 'PreprocessFollowedByLineCommentWithoutNewLine', function(emitter) {
  emitter
    .expect( 'preprocess' )
    .expect( 'comment' );
  split( '#define SOB 1 \/\/ hey', emitter );
});

test( 'SingleDeclaration', function(emitter) {
  emitter
    .expect( 'declare type', 'struct hello' );

  split( 'struct hello;', emitter );  
});

test( 'namespaceTree', function(emitter) {
  emitter
    .expect( 'define namespace', { name: 'namespace outside', code: ' namespace inside {} ' } ); 

  emitter.once( 'define namespace', function( context ) {
    emitter
      .expect( 'define namespace', { name: ' namespace inside ', code: '' } )
      .expect( 'format' );

    split( context.code, emitter );
  } );

  split( 'namespace outside{ namespace inside {} }', emitter );
}); 

test( 'namespaceDeclaration', function(emitter) {
  emitter
    .expect( 'define namespace', { name: 'namespace outside', code: ' struct hello; ' } ); 

  emitter.once( 'define namespace', function( context ) {
// <<<<<<< HEAD:test/split.js
//       emitter
//         .expect( 'format' )
//         .expect( 'declare type', 'struct hello' )
//         .expect( 'format' );
//       split( context.code );
// =======
    emitter.once( 'end', function() {
      emitter
        .expect( 'format' )
        .expect( 'declare type', 'struct hello' )
        .expect( 'code block' )
        .expect( 'end' );
      split( context.code, emitter );
    } ); 
//>>>>>>> origin/formatter:test/analyzer.js
  } ); 
  split( 'namespace outside{ struct hello; }', emitter );
});

test( 'NestedNamespaces', function() {
  emitter
    .expect( 'define namespace', { name: 'namespace outside ', code: ' namespace inside {} ' } )
    .once( 'define namespace', function( context ) {
      emitter.expect( 'define namespace', { name: ' namespace inside ', code: '' } );
      emitter.expect( 'format' );
      split( context.code, emitter );
    } ); 
  
  split( 'namespace outside { namespace inside {} }', emitter );  
});

test( 'DeclarationsAndDefinitions', function(emitter) {
  emitter
    .expect( 'declare type', 'struct hello' ); 
  split( 'struct hello;', emitter );

  emitter
    .expect( 'define type', { name: 'struct hello', code: '' } );
  split( 'struct hello{};', emitter );
});

test( 'NestedTypes', function(emitter) {
  emitter
    .expect( 'define type', { name: 'struct outside ', code: ' struct inside {}; ' } );  
  split( 'struct outside { struct inside {}; };', emitter);
} ); 

test( 'TypeWithFormat', function(emitter) {
  emitter
    .expect( 'define type', { name: ' struct inside ', code: '' })
    .expect( 'format' );
  split( ' struct inside {}; ', emitter );
});

test( 'MemberFunctionDeclare', function(emitter) {
  emitter
    .expect( 'define type' ); 
  split( 'struct text{void member();};', emitter );

  emitter
    .expect( 'declare function', 'void member()' ); 
  split('void member();', emitter ); 
}); 

test( 'FunctionDeclare', function(emitter) {
  emitter
    .expect( 'declare function', 'void foo()' );
  split( 'void foo();', emitter );
});

test( 'FunctionDefine', function(emitter) {
  emitter
    .expect( 'define function', { name: 'void foo() ', code: ' hello ' } );
  split( 'void foo() { hello }', emitter );
});

test( 'declareTypeAfterPreproesorDirective', function(emitter) {
  emitter
    .expect( 'preprocess' )
    .expect( 'declare type', 'struct bla' );
  split( '#define hello asd\nstruct bla;', emitter );
});

test( 'declareTypeAfterPreproesorDirectives', function(emitter) {
  emitter
    .expect( 'preprocess' )
    .repeat( 1 )
    .expect( 'declare type', 'struct bla' );
  split( '#define hello asd\n#define hello\\nasdfasd\nstruct bla;', emitter );
});

test( 'defineTypeAfterDeclareType', function (emitter) {
  emitter
    .expect( 'declare type', ' struct jimmy ' )  
    .expect( 'define type', { name: ' struct hey ', code: ' joe ' } );
  split( 'struct jimmy; struct hey { joe }', emitter );
});

function split( code, emitter ) {
  jargonSplit( code, function( event, obj ) { 
      emitter.emit(event, obj);
    } ); 
}
