
let splitjs = require( './../src/split' );

function split( code, emitter ) {
  splitjs(code, (type, value) => {
    emitter.emit( type, value );
  });
}

module.exports = { split };