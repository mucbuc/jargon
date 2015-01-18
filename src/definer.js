
var assert = require( 'assert' )
  , regexMap = require( './regexmap' ).regexMap;

assert( typeof regexMap !== 'undefined' );

function Definer() {

  this.process = function( obj, cb ) {
    var code = obj.lhs.replace( /.*?;/, '' );

    if (isNamespace(code)) {
      initDefine( 'namespace', code );
    }
    else if (isType(code)) {
      initDefine( 'type', code, code.match( regexMap.typeDefinitionSplitter, '' ) );
    }
    else if (isFunction(code)) {
      console.log( code );
      initDefine( 'function', code, code.match( regexMap.constructorSplitter, '' ) );
    }

    function isFunction( code ) {
      var t = code.trim();
      if (t.search( /(if|switch|for|while)\s*\(/ )==0) { 
        return false;
      }
      // same for switch, .. 
      return t[t.length - 1] == ')';
    }

    function isType( code ) {
      return code.search( /(struct|class)/ ) != -1;
    }

    function isNamespace( code ) {
      return code.indexOf( 'namespace' ) != -1;
    }

    function initDefine( type, name, matches ) {
      if (matches) {
        cb( 'define ' + type, {
          name: matches[1],
          meta: matches[2],
        } );
      }
      else {
        cb( 'define ' + type, {
          name: name,
        } );
      }
    }
  };
}

module.exports = Definer;
