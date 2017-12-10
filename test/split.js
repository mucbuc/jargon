#!/usr/bin/env node

"use strict";

var assert = require( 'chai' ).assert
  , fs = require( 'fs' )
  , path = require( 'path' )
  , jargonSplit = require( '../src/split' )
  , Expector = require( 'expector' ).SeqExpector
  , test = require( 'tape' );

assert( typeof jargonSplit === 'function' );

test( 'commentBlockPreprocessor', (t) => {
  let e = new Expector( t );
  
  e
  .expect( 'comment' )
  .expect( 'preprocess' );

  split( '/**/#endif', e );
  e.check();
});

test( 'commentBlockFormatPreprocessor', (t) => {
  let e = new Expector( t );
  
  e.expect( 'comment' )
    .expect( 'format' )
    .expect( 'preprocess' );

  split( '/**/ #endif', e );
  e.check();
});

test.skip( 'readSampleFileTemplate', (t) => {
  let e = new Expector( t );
  
  e.expect( 'comment' );

  split( readSamplesFile( 'template.h' ), e );
  e.check();
});

test( 'readSampleFile', (t) => {
  let e = new Expector( t );
  
  e.expect( 'preprocess' )
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

  split( readSamplesFile( 'test.h' ), e );
  e.check();
});

test( 'PreprocessFollowedByBlockComment', (t) => {
  let e = new Expector( t );
  
  e.expect( 'preprocess' )
    .expect( 'comment' );
  split( '#define SOB 1 \/* hey *\/', e );
  e.check();
});

test( 'PreprocessFollowedByLineComment', (t) => {
  let e = new Expector( t );
  
  e.expect( 'preprocess' )
    .expect( 'comment' )
    .expect( 'format' );
  split( '#define SOB 1 \/\/ hey\n', e );
  e.check();
});

test( 'PreprocessFollowedByLineCommentWithoutNewLine', (t) => {
  let e = new Expector( t );
  
  e.expect( 'preprocess' )
    .expect( 'comment' );
  split( '#define SOB 1 \/\/ hey', e );
  e.check();
});

test( 'SingleDeclaration', (t) => {
  let e = new Expector( t );
  
  e.expect( 'declare type', 'struct hello' );

  split( 'struct hello;', e );  
  e.check();
});

test( 'namespaceTree', (t) => {
  let e = new Expector( t );
  
  e.expect( 'define namespace', { name: 'namespace outside', code: ' namespace inside {} ' } ); 

  e.once( 'define namespace', function( context ) {
    e
      .expect( 'define namespace', { name: ' namespace inside ', code: '' } )
      .expect( 'format' );

    split( context.code, e );
  } );

  split( 'namespace outside{ namespace inside {} }', e );
  e.check();
}); 

test( 'namespaceDeclaration', (t) => {
  let e = new Expector( t );
  
  e.expect( 'define namespace', { name: 'namespace outside', code: ' struct hello; ' } ); 

  e.once( 'define namespace', function( context ) {
// <<<<<<< HEAD:test/split.js
//       emitter
//         .expect( 'format' )
//         .expect( 'declare type', 'struct hello' )
//         .expect( 'format' );
//       split( context.code );
// =======
    e.once( 'end', function() {
      e
        .expect( 'format' )
        .expect( 'declare type', 'struct hello' )
        .expect( 'code block' )
        .expect( 'end' );
      split( context.code, e );
    } ); 
//>>>>>>> origin/formatter:test/analyzer.js
  } ); 
  split( 'namespace outside{ struct hello; }', e );
  e.check();
});

test( 'NestedNamespaces', (t) => {
  let e = new Expector( t );
  
  e.expect( 'define namespace', { name: 'namespace outside ', code: ' namespace inside {} ' } )
    .once( 'define namespace', function( context ) {
      e.expect( 'define namespace', { name: ' namespace inside ', code: '' } );
      e.expect( 'format' );
      split( context.code, e );
    } ); 
  
  split( 'namespace outside { namespace inside {} }', e ); 
  e.check();
});

test( 'DeclarationsAndDefinitions', (t) => {
  let e = new Expector( t );
  
  e.expect( 'declare type', 'struct hello' ); 
  split( 'struct hello;', e );

  
  e.expect( 'define type', { name: 'struct hello', code: '' } );
  split( 'struct hello{};', e );
  e.check();
});

test( 'NestedTypes', (t) => {
  let e = new Expector( t );
  
  e.expect( 'define type', { name: 'struct outside ', code: ' struct inside {}; ' } );  
  split( 'struct outside { struct inside {}; };', e);
  e.check();
} ); 

test( 'TypeWithFormat', (t) => {
  let e = new Expector( t );
  
  e.expect( 'define type', { name: ' struct inside ', code: '' })
    .expect( 'format' );
  split( ' struct inside {}; ', e );
  e.check();
});

test( 'MemberFunctionDeclare', (t) => {
  let e = new Expector( t );
  
  e.expect( 'define type' ); 
  split( 'struct text{void member();};', e );

  
  e.expect( 'declare function', 'void member()' ); 
  split('void member();', e );
  e.check();
}); 

test( 'FunctionDeclare', (t) => {
  let e = new Expector( t );
  
  e.expect( 'declare function', 'void foo()' );
  split( 'void foo();', e );
  e.check();
});

test( 'FunctionDefine', (t) => {
  let e = new Expector( t );
  
  e.expect( 'define function', { name: 'void foo() ', code: ' hello ' } );
  split( 'void foo() { hello }', e );
  e.check();
});

test( 'declareTypeAfterPreproesorDirective', (t) => {
  let e = new Expector( t );
  
  e.expect( 'preprocess' )
    .expect( 'declare type', 'struct bla' );
  split( '#define hello asd\nstruct bla;', e );
  e.check();
});

test( 'declareTypeAfterPreproesorDirectives', (t) => {
  let e = new Expector( t );
  
  e.expect( 'preprocess' )
    .repeat( 1 )
    .expect( 'declare type', 'struct bla' );
  split( '#define hello asd\n#define hello\\nasdfasd\nstruct bla;', e );
  e.check();
});

test( 'defineTypeAfterDeclareType', (t) => {
  let e = new Expector( t );
  
  e.expect( 'declare type', ' struct jimmy ' )  
    .expect( 'define type', { name: ' struct hey ', code: ' joe ' } );
  split( 'struct jimmy; struct hey { joe }', e );
  e.check();
});

function readSamplesFile( name ) {
  return fs.readFileSync( path.join( __dirname, 'samples', name ), 'utf8' );
}

function split( code, emitter ) {
  jargonSplit( code, function( event, obj ) { 
      emitter.emit(event, obj);
  });
}
