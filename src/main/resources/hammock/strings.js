
String.prototype.hashCode = function(s) {
    return s.split("").reduce(function(a, b) {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
};

String.hashCode = function(s){
    return s.hashCode();
};

String.prototype.contains = function(needle) {
    return this.indexOf(needle) !== -1;
};

String.prototype.template = function(hash, formatters) {
    return this.replace(/{(\w+(?:\.\w+)*)(?::(\w+))?}/g, function(_, query, formatter) {
        var pieces = query.split(".");
        var selected = hash;
        for (var c = 0; c !== pieces.length; ++c) {
            selected = selected[pieces[c]];
        }
        return formatters && formatters[formatter] ? formatters[formatter](selected) : selected;
    });
};

String.template = function(str, hash, formatters) {
    return str.template(hash, formatters);
};

String.prototype.format = function() {
    var values = arguments;
    var formatters = arguments.length ? Array.prototype.last.call(arguments) : {};
    return this.replace(/{(\d+)(?::(\w+))?}/g, function(_, id, formatter) {
        var value = values[+id];
        return formatter && formatters[formatter] ? formatters[formatter](value): value;
    });
};

String.format = function(str/*, values..., optional:{formatters}*/) {
    return str.format.apply(str, Array.prototype.slice.call(arguments, 1));
};