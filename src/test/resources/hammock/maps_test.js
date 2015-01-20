describe('hammock.LinkedHashMap', function () {
    it('adding multiple values for the same key updates the value', function () {
        var map = new hammock.LinkedHashMap(identity, is);
        map.put(1, "a");
        map.put(1, "b");
        expect(map.get(1)).toEqual(["b"]);
    })
    it('adding multiple values with same hash but different key adds different entries', function () {
        var map = new hammock.LinkedHashMap(identity.curry(0), is);
        map.put(1, "a");
        map.put(2, "b");
        expect(map.entries()).toEqual([[1, "a"], [2, "b"]]);
    })
    it('asking for an unknown key yields nothing', function () {
        var map = new hammock.LinkedHashMap(identity, is);
        expect(map.get(1)).toEqual([]);
    })
    it('asking for a known key yields just(value)', function () {
        var map = new hammock.LinkedHashMap(identity, is);
        map.put(1, "1")
        expect(map.get(1)).toEqual(["1"]);
    })
    it('provide with an unknown key uses the factory value', function () {
        var map = new hammock.LinkedHashMap(identity, is);
        var got = map.provide(1, identity.curry(2))
        expect(got).toBe(2);
    })
    it('provide with a known key yields the old value', function () {
        var map = new hammock.LinkedHashMap(identity, is);
        map.put(1, "a");
        var got = map.provide(1, identity.curry('b'))
        expect(got).toBe("a");
    })
    it('contains yields true when the key is known', function () {
        var map = new hammock.LinkedHashMap(identity, is);
        map.put(1, "a");
        expect(map.contains(1)).toBe(true);
    })
    it('contains yields false when the key is unknown', function () {
        var map = new hammock.LinkedHashMap(identity, is);
        map.put(1, "a");
        expect(map.contains(2)).toBe(false);
    })
});
