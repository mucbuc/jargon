var assert = require( 'assert' )
  , regexMap = require( './regexmap' ).regexMap
  , fluke = require( 'flukejs' );

function Declarer(emitter) {

  emitter.on( 'statement', function( response ) { 
    declare( response.lhs );
  } ); 

  emitter.on( 'end', function( response ) {
    declare( response.lhs );
  } );

  function declare(code) {
    var rules = { 'statement': ';' };

    fluke.splitAll( code, function(type, response) {
        if (isType(response.lhs)) {
          emitter.emit( 'declare type', response.lhs );
        }
        else if (isFunctionDeclaration(response.lhs)) {
          emitter.emit( 'declare function', response.lhs );
        }
        else if (response.lhs.length || response.stash.length) {
          var block = 
            response.lhs 
          + response.token 
          + response.stash === 'undefined' ? '' : response.stash;
           
          emitter.emit( 'code block', block );
        }

        function isFunctionDeclaration(code) {
          return code.search( regexMap.functionDeclare ) == 0;
        }

        function isType(code) {
          return code.search( regexMap.typeDeclare ) != -1;
        }
      }, 
      rules 
    );
  }
}

module.exports = Declarer;
