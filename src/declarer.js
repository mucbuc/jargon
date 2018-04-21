/* 
  involves test types
    - declare type
    - declare function
    - code line
    - format  ???? try to move
*/

const assert = require( 'assert' )
  , regexMap = require( './regexmap' ).regexMap
  , fluke = require( 'flukejs' )
  , Formatter = require( './formatter' );

function Declarer() {

  this.register = (emitter, callback) => {

    emitter.on( 'statement', request => {
      declare( request );
    });  

    emitter.on( 'end', request => {
      declare( request );
    });

    function declare( request ) {
      process( request, ( event, obj ) => {
        let formatter = new Formatter();
        formatter.forward(event, obj, callback);
      });
    }

    return { 'statement': ';' };
  };

  function process(request, cb) {

    fluke.splitAll( request.lhs, (type, req) => {
        if (isType(req.lhs)) {
          cb( 'declare type', req.lhs );
        }
        else if (isFunctionDeclaration(req.lhs)) {
          cb( 'declare function', req.lhs );
        }
        else if (req.lhs.length || req.stash.length) {
          const block = req.lhs + (typeof req.stash === 'undefined' ? '' : req.stash);
          assert( typeof block !== 'undefined' );
          cb( !isSpace(block) ? 'code line' : 'format', block );
        }

      }, { 
        'statement': ';'
      } 
    );
  };

  function isFunctionDeclaration(code) {
    return code.search( regexMap.functionDeclare ) == 0;
  }

  function isType(code) {
    return code.search( regexMap.typeDeclare ) != -1;
  }

  function isSpace(code) {
    return code.match( /\S/ ) ? false : true; 
  }
}

module.exports = Declarer;