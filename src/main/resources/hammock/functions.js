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

Function.prototype.nary = function(arity, scope/*[optional]*/) {
    var fn = this;
    return function() {
        return fn.apply(scope || this, Array.prototype.slice.call(arguments, 0, arity))
    }
}

Function.prototype.nullary = function(scope/*[optional]*/) {
    return Function.prototype.nary.call(scope || this, 0);
}

Function.prototype.unary = function(scope/*[optional]*/) {
    return Function.prototype.nary.call(scope || this, 1);
}

Function.prototype.binary = function(scope/*[optional]*/) {
    return Function.prototype.nary.call(scope || this, 2);
}

Function.prototype.ternary = function(scope/*[optional]*/) {
    return Function.prototype.nary.call(scope || this, 3);
}

Function.prototype.intercept = function(interceptor/*(inner, arguments)*/, scope /*[optional]*/) {
    var inner = this;
    return function() {
        return interceptor.call(scope || this, inner, Array.prototype.slice.call(arguments))
    }
}

Function.prototype.and_then = function(after/*(arguments)*/, scope /*[optional]*/) {
    var self = this;
    return function() {
        return after.call(scope || this, self.apply(scope || this, arguments));
    }
}

Function.prototype.preceded_by = function(before/*(arguments)*/, scope/*[optional]*/) {
    var self = this;
    return function() {
        return self.call(scope || this, before.apply(scope || this, arguments));
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


Function.prototype.with_param = function(at, scope/*[optional]*/){
    var self = this;
    return function(){
        return self.apply(scope || this, arguments[at]);
    }
}

Function.prototype.with_first_param = function(scope/*[optional]*/){
    return this.with_param(0, scope);
}

Function.prototype.with_second_param = function(scope/*[optional]*/){
    return this.with_param(1, scope);
}

Function.prototype.with_third_param = function(scope/*[optional]*/){
    return this.with_param(2, scope);
}

Function.prototype.slicing_params = function(from, to, scope/*[optional]*/){
    var self = this;
    return function(){
        return self.apply(scope || this, Array.prototype.slice.call(arguments, from, to));
    }
}

function first_param(){
    return arguments[0];
}

function second_param(){
    return arguments[1];
}

function third_param(){
    return arguments[2];
}

function param(n){
    return function(){
        return arguments[n];
    }
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

function sum(acc, v){
    return acc + v;
}

function count(acc){
    return acc+1;
}

function is_even(e){
    return e % 2 === 0;
}

function is_odd(e){
    return e % 2 !== 0;
}

function is(lhs, rhs){
    return lhs === rhs;
}

function eq(lhs, rhs){
    return lhs == rhs;
}
