jargon
======

cpp, tokenizer, parser

### TODO:
- literalizer doesn't handle `R` syntax 

### Possible use cases
Enforce coding guidelins, move literals to the top of file, linter, reorganize code within files, create stubs, stub - out,

### token types
// levels?? 

'close'  
'code line'  
'comment block'  
'comment line'  
'declare function'  
'declare type'  
'define function'  
'define namespace'  
'define type'  
*'end'  
'format'  
'open literal'  
'open'  
'preprocess'  
'statement'  
'template parameters'  

### To automate:
`jshint src/split.js -c conf.json`  
`prettier --write "{src,test}/**/*.js"`  