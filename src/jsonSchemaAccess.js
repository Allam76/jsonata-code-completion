const {merge, some, find, uniq, map, get} = require('lodash');

module.exports = (schema) => {
    return {
        startSchema: schema,
        currentSchema: schema,
        name: "",
        setCurrentSchema(node){
            let {value} = node;
            if(this.currentSchema && this.getProp(this.currentSchema) && this.getProp(this.currentSchema)[value]){
                this.currentSchema = this.getProp(this.currentSchema)[value];
                this.name = value;
            } else if(this.currentSchema && this.currentSchema.name == value){
            } else if(this.currentSchema && (this.hasOf(this.currentSchema))) {
                this.currentSchema[this.getOf(this.currentSchema)].map((item)=>{
                    if(this.getProp(item)){
                        let prop = this.getProp(item)[value];
                        if(prop){
                            this.currentSchema = prop;
                            this.name = value;
                        } 
                    }
                })
            } else {
                this.currentSchema = null;
            }

        },
        setStartName(){
            this.currentSchema = this.startName;
        },
        getCurrentSchema(){
            return this.currentSchema
        },
        getAttribute(name){
            return this.currentSchema.properties[name];
        },
        getProposals(direction){
            if(this.currentSchema && this.hasOf(this.currentSchema)){
                return uniq([{}].concat(...this.currentSchema[this.getOf(this.currentSchema)].map((item)=>{
                    if(item.properties){
                        return map(item.properties,((item, name)=>{
                            return {name: name, label: name, type:"property", direction: direction, insertText: name}
                        }))
                    }
                })))

            } else if(this.currentSchema && this.getProp(this.currentSchema)){
                return Object.keys(this.getProp(this.currentSchema)).map((name)=>{
                    return {name: name, label: name, type:"property", direction: direction, insertText: name}
                })
            } 
        },
        setCurrent(data){
            this.current = data;
        },
        getCurrent(){
            return this.current;
        },
        hasChildNames(){
            return this.currentSchema && this.currentSchema.properties ? true : false;
        },
        hasOf(schema){
            return some(["anyOf","allOf","oneOf"],((item)=>schema[item]))
        },
        getOf(schema){
            return find(["anyOf","allOf","oneOf"],((item)=>schema[item]))
        },
        getProp(schema){
            if(schema.properties) return schema.properties;
            if(schema.items) return schema.items.properties;
        }
    }   
}

