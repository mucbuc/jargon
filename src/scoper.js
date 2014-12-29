var assert = require( 'assert' )
  , fluke = require( 'flukejs' );

function Scoper( emitter, rules ) {

  var instance = this
    , depth = 0;

  if (typeof rules === 'undefined') {
    rules = {
        'open': '{',
        'close': '}'
      };
  }

  emitter.on( 'open', function(response) {
    var depth = 1
      , source = response.rhs
      , content = '';
    emitter.emit( 'open scope', response.lhs );
    response.resetStash(); 
    do {
      fluke.splitNext(source, function(type, inner) {
        source = inner.rhs;
        content += inner.lhs;
        if (type == 'open') {
          ++depth;
          content += inner.token;
        }
        else if (type == 'close' || type == 'end') {
          if (!--depth) {
            emitter.emit( 'close scope', content );
            response.consume( content.length );
            response.resetStash();
          }
          else {
            content += inner.token;
          }
        }
        else if (type == 'end') {
          if (!--depth) {
            emitter.emit( 'end', inner );
          }
        }
      }, { 
        'open': rules.open, 
        'close': rules.close 
      } );
    } 
    while(depth); 
  } );
}

module.exports = Scoper;
