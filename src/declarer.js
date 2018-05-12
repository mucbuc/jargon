/* 
  involves test types
    - declare type
    - declare function
    - code line
    - format  ???? try to move
*/

const assert = require("assert"),
  regexMap = require("./regexmap").regexMap,
  fluke = require("flukejs"),
  format = require("./format");

function Declarer(emitter, callback) {
  emitter.on("statement", request => {
    declare(request);
  });

  emitter.on("end", request => {
    if (request.hasOwnProperty('lhs'))
    {
      declare(request);
    }
  });

  return { statement: ";" };

  function declare(request) {
    assert(request.hasOwnProperty('lhs'));
      
    fluke.splitAll(
      request.lhs,
      (type, req) => {
        if (isType(req.lhs)) {
          format("declare type", req.lhs, callback);
        } else if (isFunctionDeclaration(req.lhs)) {
          format("declare function", req.lhs, callback);
        } else if (req.lhs.length || req.stash.length) {
          const block =
            req.lhs + (typeof req.stash === "undefined" ? "" : req.stash);
          assert(typeof block !== "undefined");

          if (isSpace(block)) {
            callback("format", block, callback);
          } else {
            format("code line", block, callback);
          }
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
