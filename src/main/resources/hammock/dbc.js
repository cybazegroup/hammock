var dbc = {};


dbc.defineError = function(name){
    var err = function(message){
        Error.apply(this, arguments);        
        this.message = message;
    }
    err.prototype = new Error();
    err.prototype.constructor = err;
    err.prototype.name = name;
    return err;
}

dbc.PreconditionFailed = dbc.defineError("PreconditionFailed");
dbc.PostconditionFailed= dbc.defineError("PreconditionFailed");
dbc.IllegalState = dbc.defineError("IllegalState");
dbc.BrokenInvariant = dbc.defineError("BrokenInvariant");

dbc.error = function(type, error_fmt, args){
    return new type(String.prototype.format.apply(error_fmt, args));
}

dbc.assert = function(type, condition, error_fmt, args){
    if(!condition){
        throw dbc.error(type, error_fmt, args);
    }
    return condition
}


dbc.defined = function(type, value, error_fmt, args){
    if(value === undefined){
        throw dbc.error(type, error_fmt, args);
    }
    return value
}

dbc.not_null = function(type, value, error_fmt, args){
    dbc.defined(type, value, error_fmt, args)
    if(value === null){
        throw dbc.error(type, error_fmt, args);
    }
    return value
}

dbc.not_empty = function(type, value, error_fmt, args){
    dbc.defined(type, value, error_fmt, args)
    dbc.not_null(type, value, error_fmt, args)
    if(value.length === 0){
        throw dbc.error(type, error_fmt, args);
    }
    return value
}

dbc.instance_of = function(type, value, type, error_fmt, args){
    if(value instanceof type === false){
        throw dbc.error(type, error_fmt, args);
    }
}

dbc.boolean = function(type, value, error_fmt, args){
    dbc.defined(type, value, error_fmt, args)
    dbc.not_null(type, value, error_fmt, args)
    if(typeof value !== 'boolean'){
        throw dbc.error(type, error_fmt, args);
    }
    return value
}

dbc.number = function(type, value, error_fmt, args){
    dbc.defined(type, value, error_fmt, args)
    dbc.not_null(type, value, error_fmt, args)
    if(typeof value !== 'number'){
        throw dbc.error(type, error_fmt, args)
    }
    return value
}


dbc.array = function(type, value, error_fmt){
    dbc.defined(value, error_fmt)
    dbc.not_null(value, error_fmt)
    if(Object.prototype.toString.apply(value) !== '[object Array]'){
        throw dbc.error(error_fmt)
    }
    return value
}
dbc.fun = function(type, value, error_fmt, args){
    if(! types.isFunction(value)){
        throw dbc.error(type, error_fmt, args)
    }
}

dbc.positive = function(type, value, error_fmt, args) {
    dbc.number(type, value, error_fmt, args);
    if(value > 0)  {
        return;
    }
    throw dbc.error(type, error_fmt, args)
}

dbc.non_negative = function(type, value, error_fmt, args) {
    dbc.number(type, value, error_fmt, args);
    if(value >=0)  {
        return;
    }
    throw dbc.error(type, error_fmt, args)
}


;
(function(){
    var container = {
        precondition: {},
        invariant : {},
        state : {},
        postcondition: {}
    }

    for(var k in dbc){
        container.precondition[k] = dbc[k].curry(dbc.PreconditionFailed)
        container.invariant[k] = dbc[k].curry(dbc.BrokenInvariant)
        container.state[k] = dbc[k].curry(dbc.IllegalState)
        container.postcondition[k] = dbc[k].curry(dbc.PostconditionFailed)
    }
    for(var t in container){
        dbc[t] = container[t]
    }
})();
