var objects = {};

objects.ordering_policy = {};
objects.ordering_policy.Natural = {ordering_policy: 'natural'};
objects.ordering_policy.Lexicographical = {ordering_policy: 'lexicographical'};

objects.keys = function(obj, ordering_policy) {
    var keys = [];
    for (var key in obj) {
        keys.push(key);
    }
    if (ordering_policy === objects.ordering_policy.Lexicographical) {
        keys.sort();
    }
    return keys;
};

objects.values = function(obj, ordering_policy) {
    var keys = objects.keys(obj, ordering_policy);
    var values = [];
    for (var i = 0; i !== keys.length; ++i) {
        values.push(obj[keys[i]]);
    }
    return values;
};

objects.pairs = function(obj, ordering_policy) {
    var keys = objects.keys(obj, ordering_policy);
    var out = [];
    for (var i = 0; i !== keys.length; ++i) {
        out.push([keys[i], obj[keys[i]]]);
    }
    return out;
};

objects.shallow_copy = function(o) {
    if(o === null ){
        /* typeof null == 'object' in internet explorer */
        return o;
    }
    switch (types.type(o)) {
        case 'object':
            return objects.override({}, o);
        case 'array':
            return Array.prototype.slice.call(o);
        default:
            return o;
    }
};


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
        switch (types.type(o)) {
            case 'object':
                var copy = objects.override({}, o, f);
                seen.push(o);
                mapping.push(copy);
                return copy;
            case 'array':
                var copy = o.map(f);
                seen.push(o);
                mapping.push(copy);
                return copy;
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
};

objects.defaults = function(target, defaults) {
    for (var d in defaults) {
        if (target[d] === undefined) {
            target[d] = defaults[d];
        }
    }
    return target;
};

objects.override = function(target, src, fn/*(value)*/) {
    fn = fn ? fn : identity;
    for (var d in src) {
        target[d] = fn(src[d]);
    }
    return target;
};

objects.substitute = function(target, src) {
    for (var d in src) {
        if (undefined !== target[d]) {
            target[d] = src[d];
        }
    }
    return target;
};

objects.merge = function(destination/*,srcs..*/) {
    for (var i = 1; i !== arguments.length; ++i) {
        var source = arguments[i];
        for (var key in source) {
            var value = source[key];
            if (!value || value.constructor !== Object) {
                destination[key] = value;
                continue;
            }
            var dstValue = destination[key];
            if (!dstValue || dstValue.constructor !== Object) {
                destination[key] = objects.deep_copy(value);
                continue;
            }
            objects.merge(dstValue, value);
        }
    }
    return destination;
};

/**
 * pluck.curry('a')({a: 'value'}) => 'value'
 */
objects.pluck = function(what, from) {
    return from[what];
};

objects.deep_pluck = function(what, from) {
    return what.split(".").reduce(objects.pluck.flip().binary(), from);
};

objects.global = function(){
    return (function(){ 
        return this || (1,eval)('this')
    })();
};

objects.namespace = function(name){
    var current = objects.global();
    name.split(".").forEach(function(part){
        current = current[part] = current[part] || {};
    });
    return current;
};