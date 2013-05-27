objects.namespace('hammock');


hammock.LinkedHashSet = function(hash){
    this._hash = hash;
    this._keys = [];
    this._buckets = {};
}

hammock.LinkedHashSet.fromList = function(hash, list){
    var set = new hammock.LinkedHashSet(hash);
    for(var i=0; i!==list.length; ++i){
        set.add(list[i]);
    }
    return set;    
}

hammock.LinkedHashSet.copyOf = function(other){
    var set = new hammock.LinkedHashSet(other._hash);
    for(var i=0; i!==other._keys.length; ++i){
        set.add(other._keys[i]);
    }
    return set;
}

hammock.LinkedHashSet.merge = function(){
    dbc.precondition.assert(arguments.length > 0, "merging 0 sets");
    var set = hammock.LinkedHashSet.copy(arguments[0]);
    for(var a=1; a!== arguments.length; ++a){
        for(var i=0; i!==arguments[a]._keys.length; ++i){
            set.add(arguments[a]._keys[i]);
        }
    }
    return set;
}

hammock.LinkedHashSet.prototype = {
    _keyIndex: function(k, hash){
        if(!this._buckets.hasOwnProperty(hash)){            
            return -1;
        }
        var candidates = this._buckets[hash];
        for(var i=0; i!==candidates.length; ++i){
            var current = candidates[i];
            if(this._keys[current] === k){
                return current;
            }
        }
        return -1;
    },
    position: function(k){
        return this._keyIndex(k, this._hash(k));
    },
    contains: function(k){
        return -1 !== this._keyIndex(k, this._hash(k))
    },
    keys: function(){
        return this._keys;
    },
    add: function(k){
        var hash = this._hash(k);
        var index = this._keyIndex(k, hash)
        if(-1 !== index){
            this._keys[index] = k;
            return this;
        }
        this._keys.push(k);
        if(!this._buckets.hasOwnProperty(hash)){
            this._buckets[hash] = []
        }
        this._buckets[hash].push(this._keys.length - 1);
        return this;
    }
}