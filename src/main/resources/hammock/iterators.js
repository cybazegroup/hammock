objects.namespace('hammock');

hammock.Iterator = function () {
}

hammock.Iterator.prototype = {
    one: function () {
        dbc.state.assert(this.hasNext(), "iterator has no elements")
        var value = this.next();
        dbc.state.assert(!this.hasNext(), "iterator had more than one element")
        return value;
    },
    maybeOne: function () {
        if (!this.hasNext())
            return [];
        var value = this.next();
        dbc.state.assert(!this.hasNext(), "iterator had more than one element")
        return [value];
    },
    first: function () {
        dbc.state.assert(this.hasNext(), "iterator has no elements")
        return this.next();
    },
    maybeFirst: function () {
        return this.hasNext() ? [this.next()] : [];
    },
    last: function () {
        var maybeLast = this.maybeLast()
        dbc.state.assert(maybeLast.length === 1, "iterator has no elements");
        return maybeLast[0];
    },
    maybeLast: function () {
        var current = [];
        while (this.hasNext()) {
            current = [this.next()];
        }
        return current;
    },
    nth: function (idx) {
        var maybeNth = this.maybeNth(idx);
        dbc.state.assert(maybeNth.length === 1, "iterator has no elements");
        return maybeNth[0]
    },
    maybeNth: function (idx) {
        var current = []
        for (var c = 0; c !== idx; ++c) {
            current = [this.next()];
        }
        return current;
    },
    at: function (idx) {
        return this.nth(idx - 1);
    },
    maybeAt: function (idx) {
        return this.maybeNth(idx - 1);
    },
    all: function () {
        var c = [];
        while (this.hasNext()) {
            c.push(this.next());
        }
        return c;
    },
    forEach: function (fn) {
        while (this.hasNext()) {
            fn(this.next());
        }
    },
    foldl: function (fn/*(acc, value)*/, init) {
        //TODO: lazy
        var value = init;
        while (this.hasNext()) {
            value = fn(value, this.next());
        }
        return value;
    },
    count: function () {
        return this.foldl(count, 0);
    }
}

/**
 * Generates a prototype chain for an iterator, returning the generated constructor.
 */
hammock.Iterator.define = function (definition) {
    //TODO: shallow copy
    var constructor = definition.constructor;
    var providers = definition.hasOwnProperty('providing') ? definition.providing : {}
    delete definition.constructor;
    delete definition.providing;
    constructor.prototype = new hammock.Iterator();
    objects.override(constructor.prototype, definition);
    objects.override(hammock.Iterator.prototype, providers)
    return constructor;
}

Array.prototype.lazy = function () {
    return new hammock.ArrayIterator(this);
}

hammock.ArrayIterator = hammock.Iterator.define({
    constructor: function (array) {
        dbc.precondition.array(array, "array must be an array");
        this._array = array;
        this._index = 0;
    },
    hasNext: function () {
        return this._index !== this._array.length;
    },
    next: function () {
        dbc.state.assert(this._index !== this._array.length, 'iterator is consumed');
        return this._array[this._index++];
    }
});

hammock.TransformingIterator = hammock.Iterator.define({
    constructor: function (iter, fn) {
        dbc.precondition.not_null(iter, "iter cannot be null");
        dbc.precondition.fun(fn, "fn must be a function");
        this._inner = iter;
        this._fn = fn;
    },
    hasNext: function () {
        return this._inner.hasNext();
    },
    next: function () {
        return this._fn(this._inner.next());
    },
    providing: {
        transform: function (fn) {
            return new hammock.TransformingIterator(this, fn);
        },
        tap: function (fn) {
            return new hammock.TransformingIterator(this, function (e) {
                fn(e);
                return e;
            })
        }
    }
});

hammock.FilteringIterator = hammock.Iterator.define({
    constructor: function (iter, pred) {
        dbc.precondition.not_null(iter, "iter cannot be null");
        dbc.precondition.fun(pred, "pred must be a function");
        this._inner = iter;
        this._pred = pred;
        this._currentHasValue = false;
        this._current = null;
    },
    hasNext: function () {
        while (!this._currentHasValue && this._inner.hasNext()) {
            var val = this._inner.next();
            this._currentHasValue = this._pred(val);
            this._current = val;
        }
        return this._currentHasValue;
    },
    next: function () {
        dbc.state.assert(this.hasNext(), 'iterator is consumed');
        this._currentHasValue = false;
        return this._current;
    },
    providing: {
        filter: function (pred) {
            return new hammock.FilteringIterator(this, pred);
        },
        dropWhile: function (pred) {
            var self = this;
            var stop = false
            return new hammock.FilteringIterator(this, function () {
                stop = stop ? true : !pred.apply(self, arguments)
                return stop;
            })
        },
        drop: function (count) {
            return new hammock.FilteringIterator(this, function () {
                count = Math.max(-1, count - 1);
                return count === -1;
            });
        }
    }
});



hammock.ConstantIterator = hammock.Iterator.define({
    constructor: function (value) {
        this._value = value;
    },
    hasNext: always,
    next: function () {
        return this._value;
    }
})

hammock.ChainIterator = hammock.Iterator.define({
    constructor: function (iterators) {
        dbc.precondition.not_null(iterators, "trying to create a ChainIterator from a null iterator of iterators");
        this._iterators = iterators;
        this._current = null;
    },
    hasNext: function () {
        while ((this._current === null || !this._current.hasNext()) && this._iterators.hasNext()) {
            this._current = this._iterators.next();
        }
        return this._current !== null && this._current.hasNext();
    },
    next: function () {
        dbc.state.assert(this.hasNext(), 'iterator is consumed');
        return this._current.next();
    },
    providing: {
        chain: function (other) {
            return new hammock.ChainIterator([this, other].lazy());
        }
    }
});
hammock.Iterator.constant = function (value) {
    return new hammock.ConstantIterator(value);
}


hammock.ZipShortestIterator = hammock.Iterator.define({
    constructor: function (former, latter) {
        dbc.precondition.not_null(former, "trying to create a ZipShortestIterator from a null iterator (former)");
        dbc.precondition.not_null(latter, "trying to create a ZipShortestIterator from a null iterator (latter)");
        this._former = former;
        this._latter = latter;
    },
    hasNext: function () {
        return this._former.hasNext() && this._latter.hasNext();
    },
    next: function () {
        return [this._former.next(), this._latter.next()]
    },
    providing: {
        zips: function (other) {
            return new hammock.ZipShortestIterator(this, other);
        }
    }
})


hammock.CyclicIterator = hammock.Iterator.define({
    constructor: function (source) {
        dbc.precondition.not_null(source, "source iterator cannot be null");
        this._inner = source
        this._memory = []
    },
    hasNext: function () {
        return this._inner.hasNext() || this._memory.length !== 0;
    },
    next: function () {
        var value = this._inner.hasNext() ? this._inner.next() : this._memory.shift();
        this._memory.push(value);
        return value;
    },
    providing: {
        cycle: function () {
            return new hammock.CyclicIterator(this);
        }
    }
})

hammock.TakeWhileIterator = hammock.Iterator.define({
    constructor: function (inner, pred) {
        dbc.precondition.not_null(inner, "trying to create a TakeWhileIterator from a null iterator");
        dbc.precondition.fun(pred, "trying to create a TakeWhileIterator from a null predicate");
        this._inner = inner;
        this._pred = pred;
        this._prefetched = null;
        this._hasPrefetched = false;
    },
    hasNext: function () {
        if (this._hasPrefetched) {
            return true;
        }
        if (!this._inner.hasNext()) {
            return false;
        }
        var element = this._inner.next();
        if (this._pred(element)) {
            this._prefetched = element;
            this._hasPrefetched = true;
            return true;
        }
        return false;
    },
    next: function () {
        if (this._hasPrefetched) {
            this._hasPrefetched = false;
            return this._prefetched;
        }
        var element = this._inner.next();
        if (this._pred(element)) {
            return element;
        }
        throw dbc.state.error('iterator is consumed');
    },
    providing: {
        takeWhile: function (pred) {
            return new hammock.TakeWhileIterator(this, pred);
        },
        take: function (atMost) {
            return new hammock.TakeWhileIterator(this, function () {
                return atMost-- !== 0;
            });
        }
    }
});
