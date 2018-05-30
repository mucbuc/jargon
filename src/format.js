#!/usr/bin/env node

const assert = require("assert"),
  util = require("util"),
  events = require("events");

function format(event, info, cb) {
  assert(typeof info === "string");

  console.log( 'format in', info );

  let matches = info.match(/^(\s*)(.*?)(\s*)$/m);
  if (matches) {
    if (matches[1].length) {
      cb("format", matches[1]);
    }
    
    console.log( 'format out', matches[2] );

    cb(event, matches[2]);
    if (matches[3].length) {
      cb("format", matches[3]);
    }
  }
  else {
    cb(event, info);
  }
}

module.exports = format;
