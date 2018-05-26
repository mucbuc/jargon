#!/usr/bin/env node

let split = require("./src/split");

module.exports = (inString, outStream) => {
  return new Promise((resolve, reject) => {
    split(inString, tokenHandler);

    function tokenHandler(event, obj) {
      switch (event) {
        case "declare type":
        case "declare function": {
          outStream.write(obj + ";");
          break;
        }
        case "define type":
          outStream.write(obj.name + "{");
          split(obj.code, tokenHandler);
          outStream.write("};");
          break;
        case "define namespace":
        case "define function":
          outStream.write(obj.name + "{");
          split(obj.code, tokenHandler);
          outStream.write("}");
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
        case "template parameters":
          outStream.write(obj);
          break;
      }
    }

  });
};
