var assert = require("chai").assert,
  fluke = require("flukejs"),
  events = require("events"),
  Commenter = require("./commenter"),
  Declarer = require("./declarer"),
  Definer = require("./definer"),
  Literalizer = require("./literalizer"),
  Preprocessor = require("./preprocessor"),
  Template = require("./template");

function split(code, callback) {
  let rules = { format: "^(\\s|\\t\\n)" },
    emitter = new events.EventEmitter();

  mergeRules(Literalizer(emitter, callback));
  mergeRules(Commenter(emitter, callback));
  mergeRules(Preprocessor(emitter, callback));
  mergeRules(Definer(emitter, callback));
  mergeRules(Declarer(emitter, callback));
  mergeRules(Template(emitter, callback));

  forwardContent("define type");
  forwardContent("define function");
  forwardContent("define namespace");

  emitter.on("format", request => {
    callback("format", request.token);
  });

  fluke.splitAll(
    code,
    (type, request) => {
      emitter.emit(type, request);
    },
    rules
  );

  function mergeRules(r) {
    rules = Object.assign(rules, r);
  }

  function forwardContent(event) {
    emitter.on(event, obj => {
      emitter.once("close", content => {
        obj.code = content;
        callback(event, obj);
      });
    });
  }
}

module.exports = split;
