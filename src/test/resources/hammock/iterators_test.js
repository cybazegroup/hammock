describe('dys.ArrayIterator', function() {
    it('can be created from an empty array',function(){
        new dys.ArrayIterator([])
    })
    it('has no next when created from an empty array',function(){
        var iter = new dys.ArrayIterator([]);
        expect(iter.hasNext()).toBeFalsy();
    })
    it('can be created from a non empty array',function(){
        new dys.ArrayIterator([1])
    })
    it('has next when created from a non empty array',function(){
        var iter = new dys.ArrayIterator([1]);
        expect(iter.hasNext()).toBeTruthy();
    })
    it('calling hasNext does not consume elements',function(){
        var iter = new dys.ArrayIterator([1]);
        iter.hasNext();
        expect(iter.hasNext()).toBeTruthy();
    })
});

describe('dys.FilteringIterator', function() {
    it('can be created from an empty array',function(){
        new dys.FilteringIterator([].lazy(), always);
    })
    it('can be created from lazy',function(){
        [].lazy().filter(always);
    })
    it('filtering with always yields a copy of source',function(){
        var source = [1,2,3];
        var filtered = source.lazy().filter(always).all()
        expect(filtered).toEqual(source)
    })
});


describe('dys.TakeWhileIterator', function() {
    function isEven(x){ return x%2 === 0; }
    
    it('values after predicate evaluates to false are skipped',function(){
        var got = [0,2,3,5,6].lazy().takeWhile(isEven).all()
        expect(got).toEqual([0,2]);        
    })
});



