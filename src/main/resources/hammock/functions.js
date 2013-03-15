Function.prototype.curry = function() {
    var fn = this;
    var args = Array.prototype.slice.call(arguments);
    return function() {
        return fn.apply(this, args.concat(Array.prototype.slice.call(arguments)));
    };
}

Function.prototype.rcurry = function() {
    var fn = this;
    var args = Array.prototype.slice.call(arguments);
    return function() {
        return fn.apply(this, Array.prototype.slice.call(arguments).concat(args));
    };
}

Function.prototype.pcurry = function(/*[0,'a'],[1,'b']*/) {
    var fn = this;
    var args = Array.prototype.slice.call(arguments);
    function searchBound(i, s) {
        for (var n = 0; n !== s.length; ++n) {
            if (s[n][0] === i) {
                return [s[n][1]];
            }
        }
        return [];
    }
    return function() {
        var c = [];
        var used_args = 0;
        for (var i = 0; i !== args.length + arguments.length; ++i) {
            var maybeBound = searchBound(i, args);
            c.push(maybeBound.length === 1 ? maybeBound[0] : arguments[used_args++]);
        }
        return fn.apply(this, c);
    };
}

Function.prototype.partial = Function.prototype.curry;
Function.prototype.partialr = Function.prototype.rcurry;
Function.prototype.partialp = Function.prototype.pcurry;


Function.prototype.bind = function(scope) {
    var fn = this;
    return function() {
        return fn.apply(scope, arguments);
    };
}

Function.prototype.nary = function(arity) {
    var fn = this;
    return function() {
        return fn.apply(this, Array.prototype.slice.call(arguments, 0, arity))
    }
}

Function.prototype.nullary = function() {
    return Function.prototype.nary.call(this, 0);
}

Function.prototype.unary = function() {
    return Function.prototype.nary.call(this, 1);
}

Function.prototype.binary = function() {
    return Function.prototype.nary.call(this, 2);
}

Function.prototype.ternary = function() {
    return Function.prototype.nary.call(this, 3);
}

Function.prototype.compose = function(other) {
    var self = this;
    return function() {
        return self.call(this, other.apply(this, arguments));
    }
}

Function.prototype.intercept = function(interceptor/*(inner, arguments)*/) {
    var inner = this;
    return function() {
        return interceptor.call(this, inner, Array.prototype.slice.call(arguments))
    }
}

Function.prototype.and_then = function(after/*(arguments)*/) {
    var inner = this;
    return function() {
        var result = inner.apply(this, arguments)
        after.apply(this, arguments);
        return result;
    }
}

Function.prototype.preceded_by = function(before/*(arguments)*/) {
    var inner = this;
    return function() {
        before.apply(this, arguments);
        return inner.apply(this, arguments)
    }
}

Function.prototype.meta = function(meta) {
    for (var d in meta) {
        this[d] = meta[d];
    }
    return this
}

Function.prototype.meta_matches = function(meta) {
    for (var k in meta) {
        if (this[k] !== meta[k]) {
            return false
        }
    }
    return true
}


function noop() {
}

function identity(i) {
    return i;
}

function never() {
    return false
}

function always() {
    return true
}

