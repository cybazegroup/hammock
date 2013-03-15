var dbc = {};

dbc.error = function(error_msg, error_type){
    return new Error('['+error_type+']: ' + error_msg)
}

dbc.assert = function(condition, field_name, error_type){
    if(!condition){
        throw dbc.error('assertion failed '+field_name, error_type)
    }
    return condition
}


dbc.defined = function(value, field_name, error_type){
    if(value === undefined){
        throw dbc.error('undefined '+field_name, error_type)
    }
    return value
}

dbc.not_null = function(value, field_name,  error_type){
    dbc.defined(value, field_name, error_type)
    if(value === null){
        throw dbc.error('null ' + field_name, error_type)
    }
    return value
}

dbc.not_empty = function(value, field_name, error_type){
    dbc.defined(value, field_name, error_type)
    dbc.not_null(value, field_name, error_type)
    if(value.length === 0){
        throw dbc.error('empty '+field_name, error_type)
    }
    return value
}

dbc.is_number = function(value, field_name, error_type){
    dbc.defined(value, field_name, error_type)
    dbc.not_null(value, field_name, error_type)
    if(typeof value !== 'number'){
        throw dbc.error('not a number '+field_name, error_type)
    }
    return value
}

dbc.is_array = function(value, field_name, error_type){
    dbc.defined(value, field_name, error_type)
    dbc.not_null(value, field_name, error_type)
    if(Object.prototype.toString.apply(value) !== '[object Array]'){
        throw dbc.error('not an array '+field_name, error_type)
    }
    return value
}

dbc.instance_of = function(value,type,field_name,error_type){
    if(value instanceof type === false){
        throw dbc.error(field_name+' not of type '+type, error_type)
    }
}

dbc.is_function = function(value, field_name, error_type){
    if(! types.isFunction(value)){
        throw dbc.error(field_name+' is not of type function', error_type)
    }
}

dbc.is_positive = function(value, field_name, error_type) {
    dbc.number(value, field_name, error_type);
    if(value <= 0)  {
        throw dbc.error(field_name+' must be a positive number', error_type)
    }
}

dbc.is_non_negative = function(value, field_name, error_type) {
    dbc.number(value, field_name, error_type);
    if(value < 0)  {
        throw dbc.error(field_name+' must be a non negative number', error_type)
    }
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
        container.precondition[k] = dbc[k].rcurry('precondition')
        container.invariant[k] = dbc[k].rcurry('invariant')
        container.state[k] = dbc[k].rcurry('state')
        container.postcondition[k] = dbc[k].rcurry('postcondition')
    }
    for(var t in container){
        dbc[t] = container[t]
    }
})();
