const assert = require("assert");

function Formatter(emitter, callback) {
  emitter.on("format", req => {
    const format = req.rhs.match(/^(\s|\t|\n)*/m);
    assert(format);
    req.consume(format[0].length);

    callback("format", format[0]);
  });
}

module.exports = Formatter;