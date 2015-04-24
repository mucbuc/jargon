#!/usr/bin/env node

var assert = require( 'chai' ).assert
  , fs = require( 'fs' )
  , jargonSplit = require( '../src/split' )
  , Expector = require( 'expector' ).SeqExpector;

assert( typeof jargonSplit === 'function' );

suite( 'split', function(){

  var emitter;

  setup(function() {
      emitter = new Expector;
      emitter.setMaxListeners( 0 );
  });
  
  teardown(function() {
    emitter.check(); 
    delete emitter;
  });

  test( 'commentBlockPreprocessor', function() {
    emitter
      .expect( 'comment' )
      .expect( 'preprocess' );

    split( '/**/#endif' );
  });

  test( 'commentBlockFormatPreprocessor', function() {
    emitter
      .expect( 'comment' )
      .expect( 'format' )
      .expect( 'preprocess' );

    split( '/**/ #endif' );
  });

  test( 'readSampleFile', function() {
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

    split( fs.readFileSync( './test/samples/test.h' ).toString() );     
  });

  test( 'PreprocessFollowedByBlockComment', function() {
    emitter
      .expect( 'preprocess' )
      .expect( 'comment' );
    split( '#define SOB 1 \/* hey *\/' );
  });

  test( 'PreprocessFollowedByLineComment', function() {
    emitter
      .expect( 'preprocess' )
      .expect( 'comment' )
      .expect( 'format' );
    split( '#define SOB 1 \/\/ hey\n' );
  });

  test( 'PreprocessFollowedByLineCommentWithoutNewLine', function() {
    emitter
      .expect( 'preprocess' )
      .expect( 'comment' );
    split( '#define SOB 1 \/\/ hey' );
  });

  test( 'SingleDeclaration', function() {
    emitter
      .expect( 'declare type', 'struct hello' );

    split( 'struct hello;' );  
  });

  test( 'namespaceTree', function() {
    emitter
      .expect( 'define namespace', { name: 'namespace outside', code: ' namespace inside {} ' } ); 

    emitter.once( 'define namespace', function( context ) {
      emitter
        .expect( 'define namespace', { name: ' namespace inside ', code: '' } )
        .expect( 'format' );

      split( context.code );
    } );

    split( 'namespace outside{ namespace inside {} }' );
  }); 

  test( 'namespaceDeclaration', function() {
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
        split( context.code );
      } ); 
//>>>>>>> origin/formatter:test/analyzer.js
    } ); 
    split( 'namespace outside{ struct hello; }' );
  });

  test( 'NestedNamespaces', function() {
    emitter
      .expect( 'define namespace', { name: 'namespace outside ', code: ' namespace inside {} ' } )
      .once( 'define namespace', function( context ) {
        emitter.expect( 'define namespace', { name: ' namespace inside ', code: '' } );
        emitter.expect( 'format' );
        split( context.code );
      } ); 
    
    split( 'namespace outside { namespace inside {} }' );  
  });

  test( 'DeclarationsAndDefinitions', function() {
    emitter
      .expect( 'declare type', 'struct hello' ); 
    split( 'struct hello;' );

    emitter
      .expect( 'define type', { name: 'struct hello', code: '' } );
    split( 'struct hello{};' );
  });

  test( 'NestedTypes', function() {
    emitter
      .expect( 'define type', { name: 'struct outside ', code: ' struct inside {}; ' } );  
    split( 'struct outside { struct inside {}; };');
  } ); 

  test( 'TypeWithFormat', function() {
    emitter
      .expect( 'define type', { name: ' struct inside ', code: '' })
      .expect( 'format' );
    split( ' struct inside {}; ' );
  });

  test( 'MemberFunctionDeclare', function() {
    emitter
      .expect( 'define type' ); 
    split( 'struct text{void member();};' );

    emitter
      .expect( 'declare function', 'void member()' ); 
    split('void member();' ); 
  }); 

  test( 'FunctionDeclare', function() {
    emitter
      .expect( 'declare function', 'void foo()' );
    split( 'void foo();' );
  });

  test( 'FunctionDefine', function() {
    emitter
      .expect( 'define function', { name: 'void foo() ', code: ' hello ' } );
    split( 'void foo() { hello }' );
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
      .repeat( 1 )
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
    jargonSplit( code, function( event, obj ) { 
        emitter.emit(event, obj);
      } ); 
  }
});
