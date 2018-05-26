exports.regexMap = {
  commentMultiple: /\/\*[\s\S]*?\*\//gm,
  commentSingle: /\/\/.*\n?/g,
  include: /#.*include.*\n?/g,
  defineNewLine: /\\[ \t]*\n/gm,
  define: /#.*define.*\s*\n?/g,
  undefine: /#.*undef.*\n?/gm,
  arrayInitBlock: /\s*=.*?;/g,
  preProcessorLine: /^\s*#.*/gm,
  typeDef: /typedef.*?;/gm,
  typeDefinitionSplitter: /(.*)\s*:(.*)/,
  constructorSplitter: /(.*\))\s*:(.*)/,
  preProcessorDirective: /#.*\n/gm,
  functionDeclare: /(\w*\s*(&|\s)\s*)*[\w+\-*&^%!\[\]<>=]*\s*\(.*\)\s*/,
  typeDeclare: /(struct|class)/,
  blockDeclare: /(if|switch|for|while|do)\s*\(/
};
