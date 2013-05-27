String.prototype.template = function(hash){
    return this.replace(/{(\w+(?:\.\w+)*)}/g, function(_, query){
        var pieces = query.split(".");
        var selected = hash;
        for(var c=0;c!==pieces.length;++c){
            selected = selected[pieces[c]];
        }
        return selected;
    })    
}

String.template = function(str, hash){
    return str.template(hash);
}

String.prototype.format = function(){
    var values = arguments
    return this.replace(/{(\d+)}/g, function(_, id){
        return values[+id];
    })    
}

String.format = function(str/*, values...*/){
    return str.format.apply(str, Array.prototype.slice.call(arguments, 1));
}
