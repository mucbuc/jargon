#!/usr/bin/env node

let split = require("./src/split");

module.exports = (inString, outStream) => {
  return new Promise((resolve, reject) => {
    split(inString, function(event, obj) {
      switch (event) {
        case "declare type":
        case "declare function": {
          outStream.write(obj + ";");
          break;
        }
        case "define type":
          outStream.write(obj.name + "{" + obj.code + "};");
          break;
        case "define namespace":
        case "define function":
          outStream.write(obj.name + "{" + obj.code + "}");
          break;
        case "code line":
        case "format":
        case "comment":
        case "preprocess":
          outStream.write(obj);
          break;
        case "end":
          console.log("end");
          resolve();
          break;
      }
    });
  });
};
