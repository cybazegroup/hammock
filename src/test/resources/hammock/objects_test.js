describe('objects.pairs', function() {

    it('should return keys and values as pairs',function(){
        var pairs = objects.pairs({"a": "z", "c": "y"}, objects.ordering_policy.Lexicographical);
        expect(pairs).toEqual([["a","z"], ["c","y"]]);
    })
});