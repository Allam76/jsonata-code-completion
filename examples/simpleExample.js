const jsonata = require("jsonata");
//const Proposals = require("../src/Proposals");
const getProposals = require("../src/proposals.js");

(async function(){
    let source = `
        /*sourceSchema=http://localhost:1234/schemas/testSchema.json*/
        /*targetSchema=http://localhost:1234/schemas/testSchema.json*/
        {
            "obj": obj.name.{
                "aaa":{
                    "obj1":{`
    try {
        var exp = jsonata(source,{recover: true});
        var options = {
            //source: source,
            schemas: {
                sourceSchema: require("../tests/schemas/testSchema.json"),
                targetSchema: require("../tests/schemas/testSchema.json"),

            }
        }
        var proposals = await getProposals(exp.ast(), options);
        console.log(JSON.stringify(proposals,null,2))
    } catch(err){
        console.log(err);
    }
})();

