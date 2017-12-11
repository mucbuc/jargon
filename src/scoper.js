var assert = require( 'assert' )
  , fluke = require( 'flukejs' );

function Scoper( rules ) {

  var instance = this
    , depth = 0;

  if (typeof rules === 'undefined') {
    rules = {
        'open': '{',
        'close': '}'
      };
  }

  this.process = (req, cb) => {

    var depth = 1
      , source = req.rhs
      , content = '';
    req.resetStash(); 
    do {
      fluke.splitNext(source, (type, inner) => {
        source = inner.rhs;
        content += inner.lhs;
        if (type == 'open') {
          ++depth;
          content += inner.token;
        }
        else if (type == 'close' || type == 'end') {
          if (!--depth) {
            cb( type, content );
            req.consume( (content + inner.token).length );
            req.resetStash();
          }
          else {
            content += inner.token;
          }
        }
      }, { 
        'open': rules.open, 
        'close': rules.close 
      } );
    } 
    while(depth); 
  };
}

module.exports = Scoper;
