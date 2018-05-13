const assert = require("assert"),
  fluke = require("flukejs"),
  defaultRules = {
    open: "{",
    close: "}"
  };

function Scoper(rules = defaultRules) {
  this.process = (req, cb) => {
    let depth = 1,
      source = req.rhs,
      content = "",
      openCloseRules = {
        open: rules.open,
        close: rules.close
      };

    req.resetStash();
    do {
      fluke.splitNext(source, handler, openCloseRules);
    } while (depth);

    function handler(type, inner) {
      source = inner.rhs;
      content += inner.lhs;
      if (type == "open") {
        ++depth;
        content += inner.token;
      } else if (type == "close" || type == "end") {
        if (!--depth) {
          req.consume((content + inner.token).length);
          req.resetStash();
          cb(type, content);
        } else {
          content += inner.token;
        }
      }
    }
  };
}

module.exports = Scoper;
