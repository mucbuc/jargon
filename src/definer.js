const assert = require( 'assert' )
  , Scoper = require( './scoper' )
  , regexMap = require( './regexmap' ).regexMap;

assert( typeof Scoper === 'function' );
assert( typeof regexMap !== 'undefined' );

function Definer() {

  this.register = (emitter) => {

    emitter.on( 'open', ( request ) => {
      let scoper = new Scoper();
  
      process( request, ( type, content ) => {
        emitter.emit( type, content );
      });

      scoper.process(request, (type, content) => {
        emitter.emit( type, content );
      });    
    });

    return { 'open': '{' };
  };

  function process( obj, cb ) {

    let code = obj.lhs.replace( /.*?;/, '' );
    if (isNamespace(code)) {
      initDefine( 'namespace', code );
    }
    else if (isType(code)) {
      initDefine( 'type', code, code.match( regexMap.typeDefinitionSplitter, '' ) );
    }
    else if (isFunction(code)) {
      initDefine( 'function', code, code.match( regexMap.constructorSplitter, '' ) );
    }

    function isFunction( code ) {
      let t = code.trim();
      if (t.search( regexMap.blockDeclare )==0) { 
        return false;
      }
      return t.match( /\)[\s\w]*/ ); // [t.length - 1] == ')';
    }

    function isType( code ) {
      return code.search( regexMap.typeDeclare ) != -1;
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
