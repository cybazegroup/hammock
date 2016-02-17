
String.prototype.hashCode = function () {
    return this.split("").reduce(function (a, b) {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
};

String.hashCode = function (s) {
    return s.hashCode();
};

String.prototype.contains = function (needle) {
    return this.indexOf(needle) !== -1;
};

String.prototype.template = function (hash, formatters) {
    return this.replace(/{(\w+(?:\.\w+)*)(?::(\w+))?}/g, function (_, query, formatter) {
        var pieces = query.split(".");
        var selected = hash;
        for (var c = 0; c !== pieces.length; ++c) {
            selected = selected[pieces[c]];
        }
        return formatters && formatters[formatter] ? formatters[formatter](selected) : selected;
    });
};

String.template = function (str, hash, formatters) {
    return str.template(hash, formatters);
};

String.prototype.format = function () {
    var values = arguments;
    var formatters = arguments.length ? Array.prototype.last.call(arguments) : {};
    return this.replace(/{(\d+)(?::(\w+))?}/g, function (_, id, formatter) {
        var value = values[+id];
        return formatter && formatters[formatter] ? formatters[formatter](value) : value;
    });
};

String.format = function (str/*, values..., optional:{formatters}*/) {
    return str.format.apply(str, Array.prototype.slice.call(arguments, 1));
};

//Polyfill for old version of browser
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.substr(position, searchString.length) === searchString;
    };
}

//Polyfill for old version of browser
//https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}