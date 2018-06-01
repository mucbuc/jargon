/* 
    - declare type
    - declare function
    - code blob
    - format
*/

const assert = require("assert"),
  regexMap = require("./regexmap").regexMap,
  fluke = require("flukejs");

function Declarer(emitter, callback) {
  emitter.on("statement", request => {
    declare(request);
  });

  emitter.on("end", request => {
    if (request.hasOwnProperty("lhs")) {
      declare(request);
    }
  });

  return { statement: ";" };

  function declare(request) {
    assert(request.hasOwnProperty("lhs"));

    fluke.splitAll(
      request.lhs,
      (type, req) => {
        if (isType(req.lhs)) {
          callback("declare type", req.lhs);
        } else if (isFunctionDeclaration(req.lhs)) {
          callback("declare function", req.lhs);
        } else if (req.lhs.length || req.stash.length) {
          const block = req.lhs + req.stash,
            type = isSpace(block) ? "format" : "code blob";
          callback(type, block);
        }
      },
      {
        statement: ";"
      }
    );
  }
}

function isFunctionDeclaration(code) {
  return code.search(regexMap.functionDeclare) == 0;
}

function isType(code) {
  return code.search(regexMap.typeDeclare) != -1;
}

function isSpace(code) {
  return code.match(/\S/) ? false : true;
}

module.exports = Declarer;
