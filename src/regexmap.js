exports.regexMap = { 
	commentMultiple: /\/\*[\s\S]*?\*\//mg,
	commentSingle: /\/\/.*\n?/g,
	include: /#.*include.*\n?/g,
	defineNewLine: /\\[ \t]*\n/mg,
	define: /#.*define.*\s*\n?/g, 
	undefine: /#.*undef.*\n?/mg,
	stringLiteral: /(.*?[^/])"/,
	openLiteral: /([^//]"|^")/,
	arrayInitBlock: /\s*=.*?;/g, 
	preProcessorLine: /^\s*#.*/mg, 
	typeDef: /typedef.*?;/mg,
	typeDefinitionSplitter: /(.*)\s*:(.*)/,
	constructorSplitter: /(.*\))\s*:(.*)/,
	preProcessorDirective: /#.*\n/gm,
	functionDeclare: /(\w*\s+)*\w*\s*\(.*\)\s*/,
	typeDeclare: /(struct|class)/,
	blockDeclare: /(if|switch|for|while|do)\s*\(/
};
