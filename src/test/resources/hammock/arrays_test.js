describe('Array.prototype.dict', function() {
    it('should map first element of pair to second',function(){
        var result = [["a","b"]].dict();
        expect(result).toEqual({"a": "b"});
    })
});
