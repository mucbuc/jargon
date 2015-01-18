#!/usr/bin/env node

var assert = require( 'chai' ).assert
  , fs = require( 'fs' )
  , Analyzer = require( '../src/analyzer' )
  , Expector = require( 'expector' ).SeqExpector;

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

  test( 'commentBlockPreprocessor', function() {
    emitter
      .expect( 'comment' )
      .expect( 'preprocess' )
      .expect( 'end' );

    split( '/**/#endif' );
  });

  test( 'commentBlockFormatPreprocessor', function() {
    emitter
      .expect( 'comment' )
      .expect( 'format' )
      .expect( 'preprocess' )
      .expect( 'end' );

    split( '/**/ #endif' );
  });

  test( 'readSampleFile', function() {
    emitter
      .expect( 'preprocess' )
      .expect( 'declare type' )
      .expect( 'format' )
      .expect( 'declare function' )
      .expect( 'code block' )
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
      .expect( 'preprocess' )
      .expect( 'comment' )
      .expect( 'end' );

    split( fs.readFileSync( './test/samples/test.h' ).toString() );     
  });

  test( 'PreprocessFollowedByBlockComment', function() {
    emitter
      .expect( 'preprocess' )
      .expect( 'comment' )
      .expect( 'end' );
    split( '#define SOB 1 \/* hey *\/' );
  });

  test( 'PreprocessFollowedByLineComment', function() {
    emitter
      .expect( 'preprocess' )
      .expect( 'comment' )
      .expect( 'end' )
      .expect( 'format' );
    split( '#define SOB 1 \/\/ hey\n' );
  });

  test( 'PreprocessFollowedByLineCommentWithoutNewLine', function() {
    emitter
      .expect( 'preprocess' )
      .expect( 'comment' )
      .expect( 'end' );
    split( '#define SOB 1 \/\/ hey' );
  });

  test( 'SingleDeclaration', function() {
    emitter
      .expect( 'declare type', 'struct hello' )
      .expect( 'end' );

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
          .expect( 'end' )
          .expect( 'format' );

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
        emitter
          .expect( 'format' )
          .expect( 'declare type', 'struct hello' )
          .expect( 'end' )
          .expect( 'format' );

        split( context.code );
      } ); 
    } ); 

    split( 'namespace outside{ struct hello; }' );
  });

  test( 'NestedNamespaces', function() {
    emitter
      .expect( 'define namespace', { name: 'namespace outside ', code: ' namespace inside {} ' } )
      .once( 'define namespace', function( context ) {
        emitter.once( 'end', function() {
          emitter.expect( 'define namespace', { name: ' namespace inside ', code: '' } );
          emitter.expect( 'end' )
          emitter.expect( 'format' );
          split( context.code );
        } ); 
      } )
      .expect( 'end' ); 
    
    split( 'namespace outside { namespace inside {} }' );  
  });

  test( 'DeclarationsAndDefinitions', function() {
    emitter
      .expect( 'declare type', 'struct hello' )
      .expect( 'end' ); 
    split( 'struct hello;' );

    emitter
      .expect( 'define type', { name: 'struct hello', code: '' } )
      .expect( 'end' );
    split( 'struct hello{};' );
  });

  test( 'NestedTypes', function() {
    emitter
      .expect( 'define type', { name: 'struct outside ', code: ' struct inside {}; ' } )
      .expect( 'end' );  
    split( 'struct outside { struct inside {}; };');
  } ); 

  test( 'TypeWithFormat', function() {
    emitter
      .expect( 'define type', { name: ' struct inside ', code: '' })
      .expect( 'end' )
      .expect( 'format' );
    split( ' struct inside {}; ' );
  });

  test( 'MemberFunctionDeclare', function() {
    emitter
      .expect( 'define type' )
      .expect( 'end' ); 
    split( 'struct text{void member();};' );

    emitter
      .expect( 'declare function', 'void member()' )
      .expect( 'end' ); 
    split('void member();' ); 
  }); 

  test( 'FunctionDeclare', function() {
    emitter
      .expect( 'declare function', 'void foo()' )
      .expect( 'end' );
    split( 'void foo();' );
  });

  test( 'FunctionDefine', function() {
    emitter
      .expect( 'define function', { name: 'void foo() ', code: ' hello ' } )
      .expect( 'end' );
    split( 'void foo() { hello }' );
  });
  
  test( 'declareTypeAfterPreproesorDirective', function() {
    emitter
      .expect( 'preprocess' )
      .expect( 'declare type', 'struct bla' )
      .expect( 'end' );
    split( '#define hello asd\nstruct bla;' );
  });

  test( 'declareTypeAfterPreproesorDirectives', function() {
    emitter
      .expect( 'preprocess' )
      .repeat( 1 )
      .expect( 'declare type', 'struct bla' )
      .expect( 'end' );
    split( '#define hello asd\n#define hello\\nasdfasd\nstruct bla;' );
  });

  test( 'defineTypeAfterDeclareType', function () {
    emitter
      .expect( 'declare type', ' struct jimmy ' )  
      .expect( 'define type', { name: ' struct hey ', code: ' joe ' } )
      .expect( 'end' );
    split( 'struct jimmy; struct hey { joe }' );
  });

  function split( code ) {
    var analyzer = new Analyzer( function( event, obj ) { 
          emitter.emit(event, obj);
        });
    analyzer.split( code ); 
  }
});
