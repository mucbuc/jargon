const assert = require( 'assert' )
  , regexMap = require( './regexmap' ).regexMap
  , fluke = require( 'flukejs' );

function Declarer() {

  this.process = (request, cb) => {

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

        function isFunctionDeclaration(code) {
          return code.search( regexMap.functionDeclare ) == 0;
        }

        function isType(code) {
          return code.search( regexMap.typeDeclare ) != -1;
        }

        function isSpace(code) {
          return code.match( /\S/ ) ? false : true; 
        }

      }, { 
        'statement': ';'
      } 
    );
  };
}

module.exports = Declarer;