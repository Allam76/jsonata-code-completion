const fetch = require("node-fetch");
var deref = require('json-schema-deref-sync');
const {some, find, pick} = require('lodash');
const getSchemaAccess = require("./jsonSchemaAccess");

module.exports =  proposals = async (ast, options)=>{
    let sourceSchema;
    let targetSchema;
    let values;

    if(options.source){
        var source = options.source;
        var sourceLast = source.slice(-1);
    }

    let operators = {
        source: async (source)=>{
            let match = source.match(/sourceSchema=(.*)\*/);
            if(match && match[1]){
                sourceSchema = deref(await getSchema(match[1]));
            }
            match = source.match(/targetSchema=(.*)\*/);
            if(match && match[1]){
                targetSchema = deref(await getSchema(match[1]));
            }
        },
        schemas: (schemas) => {
            if(schemas.sourceSchema) sourceSchema = schemas.sourceSchema;
            if(schemas.targetSchema) targetSchema = schemas.targetSchema;
        }
    }

    var types = {
        function: (node, parent) => {
            var fnDef = find(varNames,{name:node.procedure.value});
            node.noParameters = fnDef.noParameters;
            if(node.arguments.length < node.noParameters){
                //values.push(",");
            } else {
                if(sourceLast !== ")"){
                    //values.push(")");
                }
                 
            }
            var argument = node.arguments[node.arguments.length - 1];
            argument.parent = node;
            this[argument.type](argument, node);
            // for(var argument of node.arguments){
            //     argument.parent = node;
            //     this[argument.type](argument, node);
            // }
        },
        error: (node, parent) => {
            if(node.parent){
                if(node.parent.type == "unary" && node.parent.value == "{"){
                    values = variables.target.access.getProposals("target", node);
                } else {
                    if(source.length == node.error.position){
                        values = addFunctionNames(sourceAccess.getProposals("source", node));
                    } else {
            
                    }          
                }
            } else {
                values = addFunctionNames(sourceAccess.getProposals("source", node));
            }
    
    
        },
        path:  (node,parent) => {
            for(var step of node.steps){
                step.parent = node;
                types[step.type](step, node);
            }
            //if(sourceAccess.hasChildNames() && sourceLast !== ".") values.push(".");       
        },
        name:(node,parent) => {
            sourceAccess.setCurrentSchema(node);
        },
        unary:  (node) => {
            types.unaryGroup(node);
        },
         unaryGroup(node){
            if(node.expressions){
                for(var expression of node.expressions){
                    expression.parent = node;
                    types[expression.type](expression);
                }
            } else {
                var lastPair = node.lhs[node.lhs.length - 1];
                lastPair[1].parent = node;
                if(lastPair[0].type == "error" && lastPair[1].type == "error"){
                    values = targetAccess.getProposals("target", node);
                    console;
                } else if(lastPair[1].type == "error"){
                    if(sourceLast == ":"){
                        values = addFunctionNames(sourceAccess.getProposals("source", node));
                        //values = values.concat(getAllVariables());
                        //values.push("{");
                        //values.push("[");
                    } else {
                        //values.push(":");
                    }
                    
                } else {
                    for(var item of lastPair){
                        item.parent = node;
                        types[item.type](item);
                    }
                    //types[lastPair[1].type](lastPair[1]);
                    if(!lastPair[1].lhs && !some(lastPair[1].steps,{type:"error"})){
                        //values.push(",");
                        //values.push("}");
                    }
                }
            }
    
        },
         group(node){
            unaryGroup(node);
        },
        literal(node){
            if(node.parent.type == "unary"){
                variables.target.access.setCurrentName(node);
            }
        },
        getAllVariables(){
            return varNames.map((item)=>{
                return "$"+item.name;
            })
        },
        variable(node){
            if(variables[node.value]){
                var variable = variables[node.value];
                variable.access = new accessClasses[variable.type](variable.name);
                sourceAccess = variable.access;
            }  
        },
        addVariables(proposals){
            if(proposals){
                var variables = varNames.map((variable)=>pick(variable,["name","type"]));
                return variables ? proposals.concat(variables): proposals;
            } else {
                return variables;
            }
        },
         block(node){
            for(var expression of node.expressions){
                expression.parent = node;
                types[expression.type](expression);   
            }
        },
        binary(node){
    
        },
         comment(node){
            if(node.value && node.value.lhs){
                let variable = {};
                
                for(var rhs of node.value.rhs){
                    variable[rhs[0].value] = rhs[1].value;
                }
                variables[node.value.lhs.value] = variable;
            }
            if(variables.target){
                variables.target.access = accessClasses[variables.target.type].build(variables.target.name);
            }
            if(variables.source && !sourceAccess){
                variables.source.access = accessClasses[variables.source.type].build(variables.source.name);
                sourceAccess = variables.source.access;
            }
            if(variables.combined){
                variables.target = {};
                sourceAccess =  variables.target.access = accessClasses.jsonSchemaComb.build(variables.combined.name);
            }        
        },
        bind(node){
            node.rhs.parent = node;
            types[node.rhs.type](node.rhs);
        },
        string(node){
            targetAccess.setCurrentSchema(node);
        }
    }
    for(var name in options) {
        await operators[name](options[name]);
    }
    let sourceAccess = getSchemaAccess(sourceSchema);
    let targetAccess = getSchemaAccess(targetSchema);

    types[ast.type](ast);
    return {suggestions: values};
}

var getSchema = async (path) => {
    let res = await fetch(path,{
        method: "GET"
    });
    return await res.json();
}
var addFunctionNames = (proposals) =>{
    return proposals;
}
