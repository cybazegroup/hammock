objects.namespace('hammock');

hammock.LinkedHashMap = function(hash){
    this._hash = hash;
    this._keys = [];
    this._values = [];
    this._buckets = {};
}

hammock.LinkedHashMap.fromPairs = function(hash, pairs){
    var lhm = new hammock.LinkedHashMap(hash);
    for(var i=0; i!==pairs.length; ++i){
        lhm.put(pairs[i][0], pairs[i][1]);
    }
    return lhm;
}

hammock.LinkedHashMap.copyOf = function(other){
    var lhm = new hammock.LinkedHashMap(other._hash);
    for(var i=0; i!==other._keys.length; ++i){
        lhm.put(other._keys[i], other._values[i]);
    }
    return lhm;
}

hammock.LinkedHashMap.merge = function(/*maps...*/){
    dbc.precondition.assert(arguments.length > 0, "merging 0 maps");
    // dbc.precondition(lhs._hash === rhs._hash, "different hash functions");
    var lhm = hammock.LinkedHashMap.copy(arguments[0]);
    for(var a=1; a!== arguments.length; ++a){
        for(var i=0; i!==rhs._keys.length; ++i){
            lhm.put(arguments[a]._keys[i], arguments[a]._values[i]);
        }
    }
    return lhm;
}



hammock.LinkedHashMap.prototype = {
    _keyIndex: function(k, hash){
        if(!this._buckets.hasOwnProperty(hash)){            
            return -1;
        }
        var candidates = this._buckets[hash];
        for(var i=0;i!==candidates.length;++i){
            var current = candidates[i];
            if(this._keys[current] === k){
                return current;
            }
        }
        return -1;
    },
    put: function(k, v){
        var hash = this._hash(k);
        var index = this._keyIndex(k, hash)
        if(-1 !== index){
            this._keys[index] = k;
            this._values[index] = v;
            return index;
        }
        this._keys.push(k);
        this._values.push(v);
        if(!this._buckets.hasOwnProperty(hash)){
            this._buckets[hash] = []
        }
        this._buckets[hash].push(this._keys.length - 1);
        return hash;
    },
    get: function(k){
        var hash = this._hash(k);
        var ki = this._keyIndex(k, hash);
        if(ki === -1){
            return [];
        }
        return [this._values[ki]];
    },
    position: function(k){
        return this._keyIndex(k, this._hash(k));    
    },
    contains: function(){
        return -1 !== this._keyIndex(k, this._hash(k));    
    },
    provide: function(k, factory){
        var got = this.get(k);
        if(got.length !== 0){
            return got[0];
        }
        var value = factory();
        this.put(k, value);
        return value;
    },
    keys: function(){
        return this._keys;
    },
    values: function(){
        return this._values;
    },
    entries: function(){
        return Array.zips(this._keys, this._values);
    }
}
