
var assert = require( 'assert' )
  , regexMap = require( './regexmap' ).regexMap;

assert( typeof regexMap !== 'undefined' );

function Definer(emitter) {

  emitter.on( 'open scope', function( source ) {
     
    var code = source.replace( /.*?;/, '' );

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
      emitter.once( 'close scope', function( code ) {
        if (matches)
          emitter.emit( 'define ' + type, {
            name: matches[1],
            code: code,
            meta: matches[2],
          } );
        else
          emitter.emit( 'define ' + type, {
            name: name,
            code: code
          } );
      } );
    }
  } );
}

module.exports = Definer;
