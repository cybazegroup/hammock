// Cannot use objects.namespace, so we are doing this by hand
var hammock = hammock || {};
hammock.array = hammock.array || {};

hammock.array.indexOf = function(needle) {
    for (var i = 0; i !== this.length; ++i) {
        if (this[i] === needle) {
            return i;
        }
    }
    return -1;
}
Array.prototype.indexOf = Array.prototype.indexOf || hammock.array.indexOf;

hammock.array.isEmpty = function() {
    return this.length === 0;
};
Array.prototype.isEmpty = Array.prototype.isEmpty || hammock.array.isEmpty;

hammock.array.contains = function(needle) {
    return this.indexOf(needle) !== -1;
};
Array.prototype.contains = Array.prototype.contains || hammock.array.contains;

/**
 * not-in-place version of [].reverse()
 **/
hammock.array.reversed = function() {
    var result = new Array(this.length);
    for (var c = 0, i = this.length - 1; i !== -1; ++c, --i) {
        result[c] = this[i];
    }
    return result;
};
Array.prototype.reversed = Array.prototype.reversed || hammock.array.reversed;

hammock.array.forEach = function(fn/*(value, index, array)*/, self) {
    for (var i = 0; i !== this.length; ++i) {
        fn.call(self, this[i], i, this);
    }
};
Array.prototype.forEach = Array.prototype.forEach || hammock.array.forEach;

/**
 * p = function(x,i){return x;}
 * filter(p, [true,false,true,false]) => [true,true]
 */
hammock.array.filter = function(pred/*(value, index, array)*/, self) {
    var result = [];
    for (var i = 0; i !== this.length; ++i) {
        if (pred.call(self, this[i], i, this)) {
            result.push(this[i]);
        }
    }
    return result;
};
Array.prototype.filter = Array.prototype.filter || hammock.array.filter;

hammock.array.map = function(fn/*(value, index, array)*/, self) {
    var result = new Array(this.length);
    for (var i = 0; i !== this.length; ++i) {
        result[i] = fn.call(self, this[i], i, this);
    }
    return result;
};
Array.prototype.map = Array.prototype.map || hammock.array.map;

Array.prototype.mapr = function(fn/*(value, index, array)*/, self) {
    var result = new Array(this.length);
    for (var c = 0, i = this.length - 1; i !== -1; ++c, --i) {
        result[c] = fn.call(self, this[i], i, this);
    }
    return result;
};

/**
 * fold(f, init, [x0, x1, x2]) => f(f(f(init, x0), x1), x2)
 **/
Array.prototype.fold = function(fn/*(accumulator, value, index, array)*/, init, self) {
    var accumulator = init;
    for (var i = 0; i !== this.length; ++i) {
        accumulator = fn.call(self, accumulator, this[i], i, this);
    }
    return accumulator;
};

/**
 * foldr(f, init, [x0, x1, x2]) => f(f(f(init, x2), x1), x0)
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
hammock.array.some = function(pred/*(value, index, array)*/, self) {
    for (var i = 0; i !== this.length; ++i) {
        if (pred.call(self, this[i], i, this)) {
            return true;
        }
    }
    return false;
};
Array.prototype.some = Array.prototype.some || hammock.array.some;

/**
 * when some is not enough.
 **/
hammock.array.every = function(pred/*(value, index, array)*/, self) {
    for (var i = 0; i !== this.length; ++i) {
        if (!pred.call(self, this[i], i, this)) {
            return false;
        }
    }
    return true;
};
Array.prototype.every = Array.prototype.every || hammock.array.every;

Array.prototype.dict = function() {
    var result = {};
    for (var i = 0; i !== this.length; ++i) {
        result[this[i][0]] = this[i][1];
    }
    return result;
};

Array.prototype.set = function() {
    var r = [];
    for (var i = 0; i !== this.length; ++i) {
        var current = this[i];
        if (!r.contains(current)) {
            r.push(current);
        }
    }
    return r;
};

Array.prototype.duplicates = function() {
    var visited = [];
    var duplicates = [];
    for (var i = 0; i !== this.length; ++i) {
        var current = this[i];
        if (!visited.contains(current)) {
            visited.push(current);
        } else {
            duplicates.push(i);
        }
    }
    return duplicates;
};

Array.prototype.orElse = function(other) {
    return this.length !== 0 ? this : other;
};

Array.prototype.head = function() {
    if (this.length === 0) {
        throw new Error("calling head on an empty Array");
    }
    return this[0];
};

Array.prototype.tail = function() {
    if (this.length === 0) {
        throw new Error("calling tail on an empty Array");
    }
    return this.slice(1);
};
Array.prototype.init = function() {
    if (this.length === 0) {
        throw new Error("calling init on an empty Array");
    }
    return this.slice(0, this.length - 1);
};
Array.prototype.last = function() {
    if (this.length === 0) {
        throw new Error("calling last on an empty Array");
    }
    return this[this.length - 1];
};

Array.prototype.fst = function() {
    if (this.length < 1) {
        throw new Error("calling fst on an empty Array");
    }
    return this[0];
};
Array.prototype.snd = function() {
    if (this.length < 2) {
        throw new Error("calling snd on an Array with less than 2 elements");
    }
    return this[1];
};
Array.prototype.trd = function() {
    if (this.length < 3) {
        throw new Error("calling trd on an Array with less than 3 elements");
    }
    return this[2];
};

Array.prototype.take = function(length) {
    if (this.length < length) {
        throw new Error("not enough elements to take");
    }
    return this.slice(0, length);
};

Array.prototype.drop = function(length) {
    if (this.length < length) {
        throw new Error("not enough elements to drop");
    }
    return this.slice(length, this.length);
};



/**
 * longest convolution
 * maps a tuple of sequences into a sequence of tuples
 * Array.zipl([1], [2,3], [4,5,6]) => [1,2,4],[undefined,3,5],[undefined,undefined,6]
 **/
Array.zipl = function(/*array1, array2, ...*/) {
    var lengths = new Array(arguments.length);
    for (var c = 0; c !== arguments.length; ++c) {
        lengths[c] = arguments[c].length;
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
};

/**
 * shortest convolution
 * maps a tuple of sequences into a sequence of tuples
 * Array.zips([1],[2,3],[4,5,6]) => [1,2,4]
 **/
Array.zips = function(/*array1, array2, ...*/) {
    var lengths = new Array(arguments.length);
    for (var c = 0; c !== arguments.length; ++c) {
        lengths[c] = arguments[c].length;
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
};

Array.iota = function(size, start, step) {
    step = step === undefined ? 1 : step;
    start = start === undefined ? 0 : start;
    var r = new Array(size);
    for (var c = 0; c !== size; ++c) {
        r[c] = c * step + start;
    }
    return r;
};

Array.prototype.iota = function(start, step) {
    return Array.iota(this.length, start, step);
};

Array.prototype.flatten = function() {
    var result = [];
    for (var c = 0; c !== this.length; ++c) {
        var inner = this[c];
        if (types.type(inner) !== 'array') {
            throw new Error("cannot flatten a non-array element");
        }
        for (var i = 0; i !== inner.length; ++i) {
            result.push(inner[i]);
        }
    }
    return result;
};
