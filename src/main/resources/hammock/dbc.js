
var dbc = {
    assertion: {},
    precondition: {},
    invariant: {},
    state: {},
    postcondition: {}
};


dbc.defineError = function(name) {
    var ctor = function(message) {
        Error.apply(this, arguments);
        this.message = message;
    }
    ctor.prototype = new Error();
    ctor.prototype.constructor = ctor;
    ctor.prototype.name = name;
    return ctor;
}

dbc.PreconditionFailed = dbc.defineError("PreconditionFailed");
dbc.PostconditionFailed = dbc.defineError("PreconditionFailed");
dbc.IllegalState = dbc.defineError("IllegalState");
dbc.BrokenInvariant = dbc.defineError("BrokenInvariant");

dbc.make_error = function(type, error_fmt, args) {
    return new type(String.prototype.format.apply(error_fmt, args));
}

dbc.assertion.assert = function(type, condition, error_fmt/*, args...*/) {
    if (condition) {
        return condition;
    }
    throw dbc.make_error(type, error_fmt, Array.prototype.slice.call(arguments, 3));
}

dbc.assertion.defined = function(type, value, error_fmt/*, args...*/) {
    if (value !== undefined) {
        return value;
    }
    throw dbc.make_error(type, error_fmt, Array.prototype.slice.call(arguments, 3));
}

dbc.assertion.not_null = function(type, value, error_fmt/*, args...*/) {
    if (value !== undefined && value !== null) {
        return value;
    }
    throw dbc.make_error(type, error_fmt, Array.prototype.slice.call(arguments, 3));
}

dbc.assertion.not_empty = function(type, value, error_fmt/*, args...*/) {
    if (value !== null && value !== undefined && value.length !== 0) {
        return value;
    }
    throw dbc.make_error(type, error_fmt, Array.prototype.slice.call(arguments, 3));
}

dbc.assertion.instance_of = function(type, value, exp, error_fmt/*, args...*/) {
    if (value instanceof exp === true) {
        return value;
    }
    throw dbc.make_error(type, error_fmt, Array.prototype.slice.call(arguments, 4));
}

dbc.assertion.boolean = function(type, value, error_fmt/*, args...*/) {
    if (types.isBoolean(value)) {
        return value;
    }
    throw dbc.make_error(type, error_fmt, Array.prototype.slice.call(arguments, 3));
}

dbc.assertion.number = function(type, value, error_fmt/*, args...*/) {
    if (types.isNumber(value)) {
        return value;
    }
    throw dbc.make_error(type, error_fmt, Array.prototype.slice.call(arguments, 3));
}

dbc.assertion.array = function(type, value, error_fmt/*, args...*/) {
    if (types.isArray(value)) {
        return value;
    }
    throw dbc.make_error(type, error_fmt, Array.prototype.slice.call(arguments, 3));
}

dbc.assertion.fun = function(type, value, error_fmt/*, args...*/) {
    if (types.isFunction(value)) {
        return value;
    }
    throw dbc.make_error(type, error_fmt, Array.prototype.slice.call(arguments, 3));
}

dbc.assertion.positive = function(type, value, error_fmt/*, args...*/) {
    if (types.isNumber(value) && value > 0) {
        return value;
    }
    throw dbc.make_error(type, error_fmt, Array.prototype.slice.call(arguments, 3));
}

dbc.assertion.non_negative = function(type, value, error_fmt/*, args...*/) {
    if (types.isNumber(value) && value >= 0) {
        return value;
    }
    throw dbc.make_error(type, error_fmt, Array.prototype.slice.call(arguments, 3))
}

;
(function() {
    for (var k in dbc.assertion) {
        dbc.precondition[k] = dbc.assertion[k].curry(dbc.PreconditionFailed)
        dbc.invariant[k] = dbc.assertion[k].curry(dbc.BrokenInvariant)
        dbc.state[k] = dbc.assertion[k].curry(dbc.IllegalState)
        dbc.postcondition[k] = dbc.assertion[k].curry(dbc.PostconditionFailed)
    }
})();
