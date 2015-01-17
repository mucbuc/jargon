var assert = require( 'assert' )
  , regexMap = require( './regexmap' ).regexMap
  , fluke = require( 'flukejs' );

function Declarer() {

  this.process = function(request, cb) {
    var code = request.lhs
      , rules = { 'statement': ';' };

    fluke.splitAll( code, function(type, req) {

        if (isType(req.lhs)) {
          cb( 'declare type', req.lhs );
        }
        else if (isFunctionDeclaration(req.lhs)) {
          cb( 'declare function', req.lhs );
        }
        else if (req.lhs.length || req.stash.length) {
          var block = req.lhs + (typeof req.stash === 'undefined' ? '' : req.stash);
          assert( typeof(block) !== 'undefined' );
          cb( 'code block', block );
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
  };
}

module.exports = Declarer;