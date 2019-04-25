import jsonata from "jsonata";
import getProposals from "../src/proposals.js";
import fs from "fs";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

(async function(){
    let source = `
        /*sourceSchema=http://localhost:1234/schemas/testSchema.json*/
        /*targetSchema=http://localhost:1234/schemas/testSchema.json*/
        {
            "obj": obj.name.{
                "aaa":{
                    "obj1":{`
    //source = "test"
    try {
        var exp = jsonata(source,{recover: true});
        var options = {
            //source: source,
            schemas: {
                sourceSchema: JSON.parse(fs.readFileSync(__dirname+"/../tests/schemas/testSchema.json")),
                targetSchema: JSON.parse(fs.readFileSync(__dirname+"/../tests/schemas/testSchema.json")),

            }
        }
        var proposals = await getProposals(exp.ast(), options);
        console.log(JSON.stringify(proposals,null,2))
    } catch(err){
        console.log(err);
    }
})();