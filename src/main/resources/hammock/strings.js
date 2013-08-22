String.prototype.contains = function(needle){
    return this.indexOf(needle) != -1;
}

String.prototype.template = function(hash, formatters){
    return this.replace(/{(\w+(?:\.\w+)*)(?::(\w+))?}/g, function(_, query, formatter){
        var pieces = query.split(".");
        var selected = hash;
        for(var c=0;c!==pieces.length;++c){
            selected = selected[pieces[c]];
        }
        return formatters && formatters[formatter] ? formatters[formatter](selected) : selected;
    })
}

String.template = function(str, hash, formatters){
    return str.template(hash, formatters);
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
