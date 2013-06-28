describe('objects.global', function() {
    it('should return keys', function() {
        var got = objects.keys({'b': 1, 'a': 2});
        expect(got).toEqual(['b', 'a']);
    });

    it('should return keys lexicographically ordered', function() {
        var got = objects.keys({'b': 1, 'a': 2}, objects.ordering_policy.Lexicographical);
        expect(got).toEqual(['a', 'b']);
    });
});

describe('objects.values', function() {
    it('should return values', function() {
        var got = objects.values({'b': 1, 'a': 2});
        expect(got).toEqual([1, 2]);
    });

    it('should return values lexicographically ordered by key', function() {
        var got = objects.values({'b': 1, 'a': 2}, objects.ordering_policy.Lexicographical);
        expect(got).toEqual([2, 1]);
    });
});


describe('objects.pairs', function() {
    it('should return keys and values as pairs', function() {
        var pairs = objects.pairs({"c": "y", "a": "z"});
        expect(pairs).toEqual([["c", "y"], ["a", "z"]]);
    });

    it('should return keys and values as pairs lexicographically ordered by key', function() {
        var pairs = objects.pairs({"a": "z", "c": "y"}, objects.ordering_policy.Lexicographical);
        expect(pairs).toEqual([["a", "z"], ["c", "y"]]);
    });
});

describe('objects.shallow_copy', function() {
    it('should return copy of non-array, non-object', function() {
        var got = objects.shallow_copy(1);
        expect(got).toEqual(1);
    });

    it('should return copy of array', function() {
        var got = objects.shallow_copy([1, 2, 3]);
        expect(got).toEqual([1, 2, 3]);
    });

    it('should return copy of object', function() {
        var got = objects.shallow_copy({a: 1, b: 2});
        expect(got).toEqual({a: 1, b: 2});
    });

    it('should return copy of complex object', function() {
        var got = objects.shallow_copy({a: 1, b: {c: 2, d: 3}, e: [1, 2]});
        expect(got).toEqual({a: 1, b: {c: 2, d: 3}, e: [1, 2]});
    });

    it('should return shallow copy of object', function() {
        var data = {a: 1, b: {c: 2, d: 3}, e: [1, 2]};
        var got = objects.shallow_copy(data);
        expect(got.b === data.b).toBeTruthy(); // same object
    });
});

describe('objects.deep_copy', function() {
    it('should return copy of non-array, non-object', function() {
        var got = objects.deep_copy(1);
        expect(got).toEqual(1);
    });

    it('should return copy of array', function() {
        var got = objects.deep_copy([1, 2, 3]);
        expect(got).toEqual([1, 2, 3]);
    });

    it('should return copy of object', function() {
        var got = objects.deep_copy({a: 1, b: 2});
        expect(got).toEqual({a: 1, b: 2});
    });

    it('should return copy of complex object', function() {
        var got = objects.deep_copy({a: 1, b: {c: 2, d: 3}, e: [1, 2]});
        expect(got).toEqual({a: 1, b: {c: 2, d: 3}, e: [1, 2]});
    });

    it('should return deep copy of object', function() {
        var data = {a: 1, b: {c: 2, d: 3}, e: [1, 2]};
        var got = objects.deep_copy(data);
        expect(got.b !== data.b).toBeTruthy(); // same object
    });
});

describe('objects.remove', function() {
    it('should remove objects from source', function() {
        var data = {a: 1, b: 2, c: 3};
        objects.remove(data, 'a', 'b');
        expect(data).toEqual({c: 3});
    });

    it('should return removed objects', function() {
        var data = {a: 1, b: 2, c: 3};
        var got = objects.remove(data, 'a', 'b');
        expect(got).toEqual({a: 1, b: 2});
    });

});

describe('objects.defaults', function() {
    it('should add missing kv', function() {
        var target = {a: 1};
        var got = objects.defaults(target, {b: 2});
        expect(got).toEqual({a: 1, b: 2});
    });

    it('should not override existing kv', function() {
        var target = {a: 1};
        var got = objects.defaults(target, {a: 2});
        expect(got).toEqual({a: 1});
    });
});

describe('objects.override', function() {
    it('should add every source kv', function() {
        var target = {a: 1};
        var got = objects.override(target, {b: 2});
        expect(got).toEqual({a: 1, b: 2});
    });

    it('should override existing kv', function() {
        var target = {a: 1};
        var got = objects.override(target, {a: 2});
        expect(got).toEqual({a: 2});
    });

    it('should assign source kv to target through a transform function', function() {
        var target = {a: 1};
        var transform = function(e) {
            return e * 2;
        };
        var got = objects.override(target, {a: 2}, transform);
        expect(got).toEqual({a: 4});
    });
});

describe('objects.substitute', function() {
    it('should override existing kv', function() {
        var target = {a: 1};
        var got = objects.substitute(target, {a: 2});
        expect(got).toEqual({a: 2});
    });

    it('should not add missing kv', function() {
        var target = {a: 1};
        var got = objects.substitute(target, {b: 2});
        expect(got).toEqual({a: 1});
    });
});

describe('objects.merge', function() {
    it('should merge sources in destination', function() {
        var destination = {a: 1};
        objects.merge(destination, {b: 2}, {c: 3});
        expect(destination).toEqual({a: 1, b: 2, c: 3});
    });

    it('should override present kv', function() {
        var destination = {a: 1};
        objects.merge(destination, {a: 2}, {b: 3});
        expect(destination).toEqual({a: 2, b: 3});
    });

    it('should merge nested objects', function() {
        var destination = {a: 1};
        objects.merge(destination, {a: 2}, {b: {c: 3}});
        expect(destination).toEqual({a: 2, b: {c: 3}});
    });
});

describe('objects.pluck', function() {
    it('can pluck same kv from different source', function() {
        var data = {a:1, b:2};
        var pluck = objects.pluck.curry('a');
        expect(pluck(data)).toEqual(1);
    });
    it('can pluck different kv from same source', function() {
        var data = {a:1, b:2};
        var pluck = objects.pluck.rcurry(data);
        expect(pluck('a')).toEqual(1);
    });
    it('can pluck different kv from different source', function() {
        var data = {a:1, b:2};
        expect(objects.pluck('a', data)).toEqual(1);
    });
});

describe('objects.deep_pluck', function() {
    it('can pluck from nested objects', function() {
        var data = {a:{b:1}};
        expect(objects.deep_pluck('a.b', data)).toEqual(1);
    });
    it('plucking from an undefined key throws', function() {
        var data = {};
        expect(function(){objects.deep_pluck('a.b', data)}).toThrow();
    });
});

describe('objects.global', function() {
    it('returns a reference to the global object', function() {
        expect(objects.global()).not.toBe(null);
    });
});

describe('objects.namespace', function() {
    it('can create a namespace', function() {
        objects.namespace("testing.glob.namespace");
        expect(testing.glob.namespace).not.toBe(null);
    });
});
