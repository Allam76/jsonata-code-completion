 var framework = (function() {
    'use strict';
    function framework(start){
        if(!start) throw "No start schema";
        return {
            current:start,
            setCurrent: function(name){
                this.current = this.current.properties[name];
            },
            getCurrent: function(){
                return this.current
            },
            getAttribute(name){
                return this.current.properties[name];
            },
            getProposals: function(){
                return Object.keys(this.current.properties).map((name)=>name)
            }   
        };
    }
    return framework;
})();
module.exports = framework;