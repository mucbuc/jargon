#!/usr/bin/env node

"use strict";

var assert = require( 'chai' ).assert
  , fs = require( 'fs' )
  , path = require( 'path' )
  , jargonSplit = require( '../src/split' )
  , tapeWrapper = require( './tape-wrapper' )
  , setUp = tapeWrapper.setUp
  , tearDown = tapeWrapper.tearDown
  , test = tapeWrapper.test;

assert( typeof jargonSplit === 'function' );

test( 'commentBlockPreprocessor', (t) => {
  let e = setUp( t );
  
  e
  .expect( 'comment' )
  .expect( 'preprocess' );

  split( '/**/#endif', e );
  tearDown(e);
});

test( 'commentBlockFormatPreprocessor', (t) => {
  let e = setUp( t );
  
  e.expect( 'comment' )
    .expect( 'format' )
    .expect( 'preprocess' );

  split( '/**/ #endif', e );
  tearDown(e);
});

test.skip( 'readSampleFileTemplate', (t) => {
  let e = setUp( t );
  
  e.expect( 'comment' );

  split( readSamplesFile( 'template.h' ), e );
  tearDown(e);
});

test( 'readSampleFile', (t) => {
  let e = setUp( t );
  
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
  tearDown(e);
});

test( 'PreprocessFollowedByBlockComment', (t) => {
  let e = setUp( t );
  
  e.expect( 'preprocess' )
    .expect( 'comment' );
  split( '#define SOB 1 \/* hey *\/', e );
  tearDown(e);
});

test( 'PreprocessFollowedByLineComment', (t) => {
  let e = setUp( t );
  
  e.expect( 'preprocess' )
    .expect( 'comment' )
    .expect( 'format' );
  split( '#define SOB 1 \/\/ hey\n', e );
  tearDown(e);
});

test( 'PreprocessFollowedByLineCommentWithoutNewLine', (t) => {
  let e = setUp( t );
  
  e.expect( 'preprocess' )
    .expect( 'comment' );
  split( '#define SOB 1 \/\/ hey', e );
  tearDown(e);
});

test( 'SingleDeclaration', (t) => {
  let e = setUp( t );
  
  e.expect( 'declare type', 'struct hello' );

  split( 'struct hello;', e );  
  tearDown(e);
});

test( 'namespaceTree', (t) => {
  let e = setUp( t );
  
  e.expect( 'define namespace', { name: 'namespace outside', code: ' namespace inside {} ' } ); 

  e.once( 'define namespace', function( context ) {
    e
      .expect( 'define namespace', { name: ' namespace inside ', code: '' } )
      .expect( 'format' );

    split( context.code, e );
  } );

  split( 'namespace outside{ namespace inside {} }', e );
  tearDown(e);
}); 

test( 'namespaceDeclaration', (t) => {
  let e = setUp( t );
  
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
  tearDown(e);
});

test( 'NestedNamespaces', (t) => {
  let e = setUp( t );
  
  e.expect( 'define namespace', { name: 'namespace outside ', code: ' namespace inside {} ' } )
    .once( 'define namespace', function( context ) {
      e.expect( 'define namespace', { name: ' namespace inside ', code: '' } );
      e.expect( 'format' );
      split( context.code, e );
    } ); 
  
  split( 'namespace outside { namespace inside {} }', e ); 
  tearDown(e);
});

test( 'DeclarationsAndDefinitions', (t) => {
  let e = setUp( t );
  
  e.expect( 'declare type', 'struct hello' ); 
  split( 'struct hello;', e );

  
  e.expect( 'define type', { name: 'struct hello', code: '' } );
  split( 'struct hello{};', e );
  tearDown(e);
});

test( 'NestedTypes', (t) => {
  let e = setUp( t );
  
  e.expect( 'define type', { name: 'struct outside ', code: ' struct inside {}; ' } );  
  split( 'struct outside { struct inside {}; };', e);
  tearDown(e);
} ); 

test( 'TypeWithFormat', (t) => {
  let e = setUp( t );
  
  e.expect( 'define type', { name: ' struct inside ', code: '' })
    .expect( 'format' );
  split( ' struct inside {}; ', e );
  tearDown(e);
});

test( 'MemberFunctionDeclare', (t) => {
  let e = setUp( t );
  
  e.expect( 'define type' ); 
  split( 'struct text{void member();};', e );

  
  e.expect( 'declare function', 'void member()' ); 
  split('void member();', e );
  tearDown(e);
}); 

test( 'FunctionDeclare', (t) => {
  let e = setUp( t );
  
  e.expect( 'declare function', 'void foo()' );
  split( 'void foo();', e );
  tearDown(e);
});

test( 'FunctionDefine', (t) => {
  let e = setUp( t );
  
  e.expect( 'define function', { name: 'void foo() ', code: ' hello ' } );
  split( 'void foo() { hello }', e );
  tearDown(e);
});

test( 'declareTypeAfterPreproesorDirective', (t) => {
  let e = setUp( t );
  
  e.expect( 'preprocess' )
    .expect( 'declare type', 'struct bla' );
  split( '#define hello asd\nstruct bla;', e );
  tearDown(e);
});

test( 'declareTypeAfterPreproesorDirectives', (t) => {
  let e = setUp( t );
  
  e.expect( 'preprocess' )
    .repeat( 1 )
    .expect( 'declare type', 'struct bla' );
  split( '#define hello asd\n#define hello\\nasdfasd\nstruct bla;', e );
  tearDown(e);
});

test( 'defineTypeAfterDeclareType', (t) => {
  let e = setUp( t );
  
  e.expect( 'declare type', ' struct jimmy ' )  
    .expect( 'define type', { name: ' struct hey ', code: ' joe ' } );
  split( 'struct jimmy; struct hey { joe }', e );
  tearDown(e);
});

function readSamplesFile( name ) {
  return fs.readFileSync( path.join( __dirname, 'samples', name ), 'utf8' );
}

function split( code, emitter ) {
  jargonSplit( code, function( event, obj ) { 
      emitter.emit(event, obj);
  });
}
