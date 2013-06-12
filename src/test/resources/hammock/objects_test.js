describe('objects.pairs', function() {
    it('should return keys and values as pairs',function(){
        var pairs = objects.pairs({"a": "z", "c": "y"}, objects.ordering_policy.Lexicographical);
        expect(pairs).toEqual([["a","z"], ["c","y"]]);
    })
});

describe('objects.global', function() {
    it('returns a reference to the global object',function(){
        expect(objects.global()).not.toBe(null);
    })
});

describe('objects.namespace', function() {
    it('can create a namespace',function(){
        objects.namespace("testing.glob.namespace");
        expect(testing.glob.namespace).not.toBe(null);
    })
});

describe('objects.defaults', function() {
    it('will not override existing value', function() {
       var got = objects.defaults({a: 1}, {a: 2}); 
       expect({a: 1}).toEqual(got);
    });
    
    it ('will add a default value if key is missing', function() {
        var got = objects.defaults({a: 1}, {b: 2}); 
        expect({a: 1, b: 2}).toEqual(got);
    });
});