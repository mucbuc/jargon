
var assert = require( 'assert' )
  , regexMap = require( './regexmap' ).regexMap;

assert( typeof regexMap !== 'undefined' );

function Definer(emitter) {

  emitter.on( 'open', function( obj ) {
    var code = obj.lhs.replace( /.*?;/, '' );

    if (isNamespace(code))
      initDefine( 'namespace', code );
    else if (isType(code))
      initDefine( 'type', code, code.match( regexMap.typeDefinitionSplitter, '' ) );
    else if (isFunction(code))
      initDefine( 'function', code, code.match( regexMap.constructorSplitter, '' ) );

    function isFunction( code ) {
      var t = code.trim();
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
        emitter.emit( 'define ' + type, {
          name: matches[1],
          meta: matches[2],
        } );
      }
      else {
        emitter.emit( 'define ' + type, {
          name: name,
        } );
      }
    }
  } );
}

module.exports = Definer;
