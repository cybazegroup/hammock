Array.prototype.indexOf = Array.prototype.indexOf || function(needle) {
    for (var i = 0; i !== this.length; ++i) {
        if (this[i] === needle) {
            return i;
        }
    }
    return -1;
}

Array.prototype.contains = Array.prototype.contains || function(needle) {
    return this.indexOf(needle) !== -1;
}

/**
 * not-in-place version of [].reverse()
 **/
Array.prototype.reversed = Array.prototype.reversed || function() {
    var result = new Array(this.length);
    for (var c = 0, i = this.length - 1; i !== -1; ++c, --i) {
        result[c] = this[i];
    }
    return result;
}

Array.prototype.forEach = Array.prototype.forEach || function(fn/*(value, index, array)*/, self) {
    for (var i = 0; i !== this.length; ++i) {
        fn.call(self, this[i], i, this);
    }
}

/**
 * p = function(x,i){return x;}
 * filter(p, [true,false,true,false]) => [true,true]
 */
Array.prototype.filter = Array.prototype.filter || function(pred/*(value, index, array)*/, self) {
    var result = [];
    for (var i = 0; i !== this.length; ++i) {
        if (pred.call(self, this[i], i, this)) {
            result.push(this[i]);
        }
    }
    return result;
}

Array.prototype.map = Array.prototype.map || function(fn/*(value, index, array)*/, self) {
    var result = new Array(this.length);
    for (var i = 0; i !== this.length; ++i) {
        result[i] = fn.call(self, this[i], i, this);
    }
    return result;
}

Array.prototype.mapr = function(fn/*(value, index, array)*/, self) {
    var result = new Array(this.length);
    for (var c = 0, i = this.length - 1; i !== -1; ++c, --i) {
        result[c] = fn.call(self, this[i], i, this);
    }
    return result;
}

/**
 * fold(f, init, [x0, x1, x2]) => f(f(f(init, x0), x1), x2)
 **/
Array.prototype.fold = function(fn/*(accumulator, value, index, array)*/, init, self) {
    var accumulator = init;
    for (var i = 0; i !== this.length; ++i) {
        accumulator = fn.call(self, accumulator, this[i], i, this);
    }
    return accumulator;
}

/**
 * foldr(f, init, [x0, x1, x2]) => f(f(f(init, x2), x1), xo)
 **/
Array.prototype.foldr = function(fn/*accumulator, value, index, array*/, init, self) {
    var accumulator = init;
    for (var i = this.length - 1; i !== -1; --i) {
        accumulator = fn.call(self, accumulator, this[i], i, this);
    }
    return accumulator;
}


/**
 * Tests whether some element in the array passes the test implemented by the provided function.
 **/
Array.prototype.some = Array.prototype.some || function(pred/*(value, index, array)*/, self) {
    for (var i = 0; i !== this.length; ++i) {
        if (pred.call(self, this[i], i, this)) {
            return true;
        }
    }
    return false;
}

/**
 * when some is not enough.
 **/
Array.prototype.every = Array.prototype.every || function(pred/*(value, index, array)*/, self) {
    for (var i = 0; i !== this.length; ++i) {
        if (!pred.call(self, this[i], i, this)) {
            return false;
        }
    }
    return true;
}

Array.prototype.dict = function() {
    var result = {};
    for (var i = 0; i !== this.length; ++i) {
        result[this[i][0]] = this[i][1];
    }
    return result;
}

Array.prototype.set = function() {
    var r = [];
    for (var i = 0; i !== this.length; ++i) {
        var current = this[i];
        if (!r.contains(current)) {
            r.push(current);
        }
    }
    return r;
}

Array.prototype.duplicates = function() {
    var visited = []
    var duplicates = []
    for (var i = 0; i !== this.length; ++i) {
        var current = this[i];
        if (!visited.contains(current)) {
            visited.push(current);
        } else {
            duplicates.push(i)
        }
    }
    return duplicates;
}

Array.prototype.orElse = function(other) {
    return this.length !== 0 ? this : other;
}

Array.prototype.head = function() {
    if (this.length === 0) {
        throw new Error("calling head on an empty Array");
    }
    return this[0];
}
Array.prototype.tail = function() {
    if (this.length === 0) {
        throw new Error("calling tail on an empty Array");
    }
    return this.slice(1);
}
Array.prototype.init = function() {
    if (this.length === 0) {
        throw new Error("calling init on an empty Array");
    }
    return this.slice(0, this.length - 1);
}
Array.prototype.last = function() {
    if (this.length === 0) {
        throw new Error("calling last on an empty Array");
    }
    return this[this.length - 1];
}

Array.prototype.fst = function(){
    if (this.length === 0) {
        throw new Error("calling fst on an empty Array");
    }
    return this[0];
}
Array.prototype.snd = function(){
    if (this.length < 1) {
        throw new Error("calling fst on an empty Array");
    }
    return this[1];        
}
Array.prototype.trd = function(){
    if (this.length < 2) {
        throw new Error("calling fst on an empty Array");
    }
    return this[2];            
}

Array.prototype.take = function(length) {
    if (this.length < length) {
        throw new Error("not enough elements to take");
    }
    return this.slice(0, length);
}

Array.prototype.drop = function(length) {
    if (this.length < length) {
        throw new Error("not enough elements to drop");
    }
    return this.slice(length, this.length);
}



/**
 * longest convolution
 * maps a tuple of sequences into a sequence of tuples
 * Array.zipl([1], [2,3], [4,5,6]) => [1,2,4],[undefined,3,5],[undefined,undefined,6]
 **/
Array.zipl = function(/*array1, array2, ...*/) {
    var lengths = new Array(arguments.length)
    for (var c = 0; c !== arguments.length; ++c) {
        lengths[c] = arguments[c].length
    }
    var sequence_size = Math.max.apply(null, lengths);
    var result = new Array(sequence_size);
    for (var seq_index = 0; seq_index !== sequence_size; ++seq_index) {
        var tuple = new Array(arguments.length);
        for (var arg_index = 0; arg_index !== arguments.length; ++arg_index) {
            tuple[arg_index] = arguments[arg_index][seq_index];
        }
        result[seq_index] = tuple;
    }
    return result;
}

/**
 * shortest convolution
 * maps a tuple of sequences into a sequence of tuples
 * Array.zips([1],[2,3],[4,5,6]) => [1,2,4]
 **/
Array.zips = function(/*array1, array2, ...*/) {
    var lengths = new Array(arguments.length)
    for (var c = 0; c !== arguments.length; ++c) {
        lengths[c] = arguments[c].length
    }
    var sequence_size = Math.min.apply(null, lengths);
    var result = new Array(sequence_size);
    for (var seq_index = 0; seq_index !== sequence_size; ++seq_index) {
        var tuple = new Array(arguments.length);
        for (var arg_index = 0; arg_index !== arguments.length; ++arg_index) {
            tuple[arg_index] = arguments[arg_index][seq_index];
        }
        result[seq_index] = tuple;
    }
    return result;
}

Array.iota = function(size, start, step) {
    step = step === undefined ? 1 : step
    start = start === undefined ? 0 : start
    var r = new Array(size);
    for (var c = 0; c !== size; ++c) {
        r[c] = c * step + start;
    }
    return r;
}

Array.prototype.iota = function(start, step) {
    return Array.iota(this.length, start, step);
}

String.prototype.format = function(){
    var values = arguments
    return this.replace(/{(\d+)}/g, function(_, id){
        return values[+id];
    })    
}
