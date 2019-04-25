# jsonata-code-completion
jsonata code completion built to me used in the monaco editor(https://microsoft.github.io/monaco-editor/index.html)

This is a code completer based on json schemas both for source and target data. Jsonata allows to build a json from another json input. Added with schemas for both input and output, this will add code completion. Note that for vscode, more work has to be done since vscode uses a language server.

# usage
The schemas can either be addes as jsonata comments and supports http/s protocol only since fetch does not allow local file system access.
```
        /*sourceSchema=http://localhost:1234/schemas/testSchema.json*/
        /*targetSchema=http://localhost:1234/schemas/testSchema.json*/
```
Here url starting with sourceSchema and targetSchema will be extracted and loaded with fetch.

Also schemas can be loaded programmatically:
```javascript
    let source = `
        {
            "obj": obj.name.{
                "aaa":{
                    "obj1":{`
        var exp = jsonata(source,{recover: true});
        var options = {
            //source: source,
            schemas: {
                sourceSchema: require("../tests/schemas/testSchema.json"),
                targetSchema: require("../tests/schemas/testSchema.json"),

            }
        }
        var proposals = await getProposals(exp.ast(), options);
```
Here the source and target schema is set from code. 

## installation
```
npm install
```
## Quick start
node version: in examples/simpleExample.js

browser:
```
npm run browserify
node tests/server.js

goto http://localhost:1234/examples/index.html
```
