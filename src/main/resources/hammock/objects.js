var objects = {};

objects.ordering_policy = {}
objects.ordering_policy.Natural = {ordering_policy: 'natural'}
objects.ordering_policy.Lexicographical = {ordering_policy: 'lexicographical'}

objects.keys = function(obj, ordering_policy) {
    var keys = []
    for (var key in obj) {
        keys.push(key)
    }
    if (ordering_policy === objects.ordering_policy.Lexicographical) {
        keys.sort();
    }
    return keys;
}

objects.values = function(obj, ordering_policy) {
    var keys = objects.keys(obj, ordering_policy);
    var values = []
    for (var i = 0; i !== keys.length; ++i) {
        values.push(obj[keys[i]]);
    }
    return values;
}

objects.pairs = function(obj, ordering_policy) {
    var keys = objects.keys(obj, ordering_policy);
    var out = []
    for (var i = 0; i !== keys.length; ++i) {
        out.push([keys[i], obj[keys[i]]])
    }
    return out;
}

objects.shallow_copy = function(o) {
    if(o === null ){
        /* typeof null == 'object' in internet explorer */
        return o;
    }
    switch (typeof o) {
        case 'object':
            return objects.override({}, o);
        case 'array':
            return Array.prototype.slice.call(o);
        default:
            return o;
    }
}


objects.deep_copy = function(obj) {
    var seen = [];
    var mapping = [];
    var f = function(o) {
        if( o === null ){ 
            /* typeof null == 'object' in internet explorer */
            return o;
        }
        var i = seen.indexOf(o);
        if (i !== -1) {
            return mapping[i];
        }
        switch (typeof o) {
            case 'object':
                seen.push(o);
                return mapping.push(objects.override({}, o, f));
            case 'array':
                seen.push(o);
                return mapping.push(o.map(f));
            default:
                return o;
        }
    }
    return f(obj);
}
/**
 *
 * i.e:
 *  var src = { field1: 0, field2: 0, field3: 0, field4: 0 };
 *  var removed = objects.remove(src,'field1','field2','field3');
 *  >> src = { field4: 0}
 *  >> removed = { field1: 0, field2: 0, field3: 0 }
 **/
objects.remove = function() {
    if (arguments.length < 2) {
        throw "called objects.remove with insufficent arguments";
    }
    var o = arguments[0];
    var removed = {};
    for (var i = 1; i !== arguments.length; ++i) {
        var field = arguments[i];
        removed[field] = o[field];
        delete o[field];
    }
    return removed;
}

objects.defaults = function(target, defaults) {
    for (var d in defaults) {
        if (target[d] !== undefined) {
            target[d] = defaults[d];
        }
    }
    return target;
}

objects.override = function(target, src, fn/*(value)*/) {
    fn = fn ? fn : identity;
    for (var d in src) {
        target[d] = fn(src[d]);
    }
    return target;
}

objects.substitute = function(target, src) {
    for (var d in src) {
        if (undefined !== target[d]) {
            target[d] = src[d];
        }
    }
    return target;
}

/**
 * pluck.curry('a')({a: 'value'}) => 'value'
 */
objects.pluck = function(what, from) {
    return from[what];
}
