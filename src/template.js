/*
  note: Template doesn't listen for 'end' event ==> this should generate an error since
        templates are always declarations or definitions
*/

var assert = require("assert"),
  fluke = require("flukejs"),
  Scoper = require("./scoper"),
  events = require("events");

assert(typeof Scoper !== "undefined");

function Template(emitter, callback) {
  emitter.on("open template", request => {
    assert(request.hasOwnProperty("resetStash"));
    const rules = { open: "<", close: ">" },
      sub = new events.EventEmitter(),
      scoper = new Scoper(rules);

    scoper.process(request, (type, content) => {
      const result = request.token + request.lhs + content.trim() + rules.close;
      callback(
        "template parameters",
        result
      );
    });
  });

  return { "open template": "template\s*<" };
}

module.exports = Template;
