#!/usr/bin/env node

let split = require("./src/split");

module.exports = (inString, outStream) => {
  return new Promise((resolve, reject) => {
    split(inString, tokenHandler);

    function tokenHandler(event, obj) {
      
      //outStream.write(event + ": ");

      switch (event) {
        case "define namespace":
        case "define function":
        case "define type":
          outStream.write(obj.name + "{");
          split(obj.code, tokenHandler);
          outStream.write("}");
          break;
        case "code blob":
        case "format":
        case "comment":
        case "preprocess":
        case "template parameters":
        case "declare type":
        case "declare function":
          outStream.write(obj);
          break;
        case "end":
          resolve();
          break;
      }

      switch (event) {
        case "code blob":
        case "declare type":
        case "declare function":
        case "define type":
          outStream.write(";");
          break;
      }
    }
  });
};
