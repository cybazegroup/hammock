describe('hammock.array.indexOf', function() {
    it('should return index of contained element', function() {
        var data = ['a', 'b', 'c'];
        var got = hammock.array.indexOf.call(data, 'b');
        expect(got).toEqual(1);
    });

    it('should return -1 if element is not contained', function() {
        var data = ['a', 'b', 'c'];
        var got = hammock.array.indexOf.call(data, 'z');
        expect(got).toEqual(-1);
    });

    it('should return index of first occurrence of element', function() {
        var data = ['a', 'a', 'a'];
        var got = hammock.array.indexOf.call(data, 'a');
        expect(got).toEqual(0);
    });
});

describe('hammock.array.isEmpty', function() {
    it('should return true for an empty array', function() {
        var data = [];
        var got = hammock.array.isEmpty.call(data);
        expect(got).toEqual(true);
    });

    it('should return false for a non-empty array', function() {
        var data = [''];
        var got = hammock.array.isEmpty.call(data);
        expect(got).toEqual(false);
    });
});

describe('hammock.array.contains', function() {
    it('should return true if element is contained', function() {
        var data = ['a', 'b', 'c'];
        var got = hammock.array.contains.call(data, 'a');
        expect(got).toEqual(true);
    });

    it('should return false if element is not contained', function() {
        var data = ['a', 'b', 'c'];
        var got = hammock.array.contains.call(data, 'z');
        expect(got).toEqual(false);
    });
});

describe('hammock.array.reversed', function() {
    it('should return an array with elements in reverse order', function() {
        var data = ['a', 'b', 'c'];
        var got = hammock.array.reversed.call(data);
        expect(got).toEqual(['c', 'b', 'a']);
    });
});

describe('hammock.array.forEach', function() {
    it('should call fn for each array element', function() {
        var data = ['a', 'b', 'c'];
        var got = [];
        hammock.array.forEach.call(data, function(element, index, array) {
            got.push(element);
        });
        expect(got).toEqual(['a', 'b', 'c']);
    });

    it('second fn param is element index', function() {
        var data = ['a', 'b', 'c'];
        var got = [];
        hammock.array.forEach.call(data, function(element, index, array) {
            got.push(index);
        });
        expect(got).toEqual([0, 1, 2]);
    });

    it('third fn param is entire array', function() {
        var data = ['a', 'b', 'c'];
        var got = [];
        hammock.array.forEach.call(data, function(element, index, array) {
            got.push(array);
        });
        expect(got).toEqual([data, data, data]);
    });
});

describe('hammock.array.filter', function() {
    it('keeps elements for which predicate evaluates as true', function() {
        var data = ['a', 'b', 'c'];
        var got = hammock.array.filter.call(data, function(element, index, array) {
            return element === 'a';
        });
        expect(got).toEqual(['a']);
    });

    it('returns empty array if predicate condition is never met', function() {
        var data = ['a', 'b', 'c'];
        var got = hammock.array.filter.call(data, never);
        expect(got).toEqual([]);
    });

    it('throws if called with undefined', function() {
        var data = ['a', 'b', 'c'];
        expect(function() {
            hammock.array.filter.call(data, undefined);
        }).toThrow();
    });

    it('second fn param is element index', function() {
        var data = ['a', 'b', 'c'];
        var got = hammock.array.filter.call(data, function(element, index, array) {
            return index > 1;
        });
        expect(got).toEqual(['c']);
    });

    it('third fn param is entire array', function() {
        var data = ['a', 'b', 'c'];
        var got = hammock.array.filter.call(data, function(element, index, array) {
            return data === array;
        });
        expect(got).toEqual(data);
    });
});

describe('hammock.array.map', function() {
    it('should transform all elements', function() {
        var data = ['a', 'b', 'c'];
        var got = hammock.array.map.call(data, identity);
        expect(got.length).toEqual(data.length);
    });

    it('throws if called with undefined', function() {
        var data = ['a', 'b', 'c'];
        expect(function() {
            hammock.array.map.call(data, undefined);
        }).toThrow();
    });

    it('first fn param is element', function() {
        var data = ['a', 'b', 'c'];
        var got = hammock.array.map.call(data, function(element, index, array) {
            return element;
        });
        expect(got).toEqual(data);
    });

    it('second fn param is element index', function() {
        var data = ['a', 'b', 'c'];
        var got = hammock.array.map.call(data, function(element, index, array) {
            return index;
        });
        expect(got).toEqual([0, 1, 2]);
    });

    it('third fn param is entire array', function() {
        var data = ['a', 'b', 'c'];
        var got = hammock.array.map.call(data, function(element, index, array) {
            return array[index];
        });
        expect(got).toEqual(data);
    });
});

describe('Array.prototype.mapr', function() {

    it('should transform all elements', function() {
        var got = ['a', 'b', 'c'].mapr(identity);
        expect(got.length).toEqual(3);
    });

    it('elements are transformed in reverse order', function() {
        var got = ['a', 'b', 'c'].mapr(identity);
        expect(got).toEqual(['c', 'b', 'a']);
    });

    it('throws if called with undefined', function() {
        expect(function() {
            ['a', 'b', 'c'].mapr(undefined);
        }).toThrow();
    });

    it('first fn param is element', function() {
        var got = ['a', 'b', 'c'].mapr(function(element, index, array) {
            return element;
        });
        expect(got).toEqual(['c', 'b', 'a']);
    });

    it('second fn param is element index', function() {
        var got = ['a', 'b', 'c'].mapr(function(element, index, array) {
            return index;
        });
        expect(got).toEqual([2, 1, 0]);
    });

    it('third fn param is entire array', function() {
        var got = ['a', 'b', 'c'].mapr(function(element, index, array) {
            return array[index];
        });
        expect(got).toEqual(['c', 'b', 'a']);
    });
});

describe('Array.prototype.fold', function() {

    it('should accumulate fn result for all element', function() {
        var got = [1, 2, 3].fold(sum, 0);
        expect(got).toEqual(6);
    });

    it('init value offsets fold result', function() {
        var got = [1, 2, 3].fold(sum, -6);
        expect(got).toEqual(0);
    });

});

describe('Array.prototype.foldr', function() {

    it('should accumulate fn result for all element in reverse order', function() {

        var got = [1, 2, 3].foldr(function(accumulator, value) {
            accumulator.push(value);
            return accumulator;
        }, []);
        expect(got).toEqual([3, 2, 1]);
    });

});

describe('hammock.array.some', function() {
    it('should return true if predicate evaluates as true for at least one element', function() {
        var data = ['a', 'b', 'c'];
        var got = hammock.array.some.call(data, function(e) {
            return e === 'a';
        });
        expect(got).toEqual(true);
    });
    it('should return false if predicate never evaluates as true', function() {
        var data = ['a', 'b', 'c'];
        var got = hammock.array.some.call(data, never);
        expect(got).toEqual(false);
    });
});

describe('hammock.array.every', function() {
    it('should return true if predicate evaluates as true for all elements', function() {
        var data = ['a', 'b', 'c'];
        var got = hammock.array.every.call(data, always);
        expect(got).toEqual(true);
    });
    it('should return false if predicate evaluates as false at least once', function() {
        var data = ['a', 'b', 'c'];
        var got = hammock.array.every.call(data, function(e) {
            return e !== 'a';
        });
        expect(got).toEqual(false);
    });
});

describe('Array.prototype.dict', function() {
    it('should map first element of pair to second', function() {
        var result = [["a", "b"]].dict();
        expect(result).toEqual({"a": "b"});
    });
});

describe('Array.prototype.set', function() {
    it('should return an array containing only unique elements', function() {
        var result = [1, 1, 2, 2, 3, 3].set();
        expect(result).toEqual([1, 2, 3]);
    });
});

describe('Array.prototype.duplicates', function() {
    it('should return an array containing indexes of duplicate elements', function() {
        var result = [1, 1, 1, 2, 2, 3].duplicates();
        expect(result).toEqual([1, 2, 4]);
    });
});

describe('Array.prototype.orElse', function() {
    it('should return source array if it\'s not empty', function() {
        var got = [1].orElse([2]);
        expect(got).toEqual([1]);
    });

    it('should return other array if source is empty', function() {
        var got = [].orElse([2]);
        expect(got).toEqual([2]);
    });

    it('other value can be anything', function() {
        var got = [].orElse({});
        expect(got).toEqual({});
    });
});

describe('Array.prototype.head', function() {

    it('should return first element of array', function() {
        var got = [1, 2, 3].head();
        expect(got).toEqual(1);
    });

    it('should throw when array is empty', function() {
        expect(function() {
            [].head();
        }).toThrow();
    });
});

describe('Array.prototype.tail', function() {

    it('should return array without first element', function() {
        var got = [1, 2, 3].tail();
        expect(got).toEqual([2, 3]);
    });
    it('should return empty array for single-element source', function() {
        var got = [1].tail();
        expect(got).toEqual([]);
    });

    it('should throw when array is empty', function() {
        expect(function() {
            [].tail();
        }).toThrow();
    });
});

describe('Array.prototype.init', function() {

    it('should return array without last element', function() {
        var got = [1, 2, 3].init();
        expect(got).toEqual([1, 2]);
    });

    it('should return empty array for single-element source', function() {
        var got = [1].init();
        expect(got).toEqual([]);
    });

    it('should throw when array is empty', function() {
        expect(function() {
            [].init();
        }).toThrow();
    });
});

describe('Array.prototype.last', function() {

    it('should return last element', function() {
        var got = [1, 2, 3].last();
        expect(got).toEqual(3);
    });

    it('should throw when array is empty', function() {
        expect(function() {
            [].last();
        }).toThrow();
    });
});


describe('Array.prototype.fst', function() {

    it('should return first element', function() {
        var got = [1, 2, 3].fst();
        expect(got).toEqual(1);
    });

    it('should throw when array is empty', function() {
        expect(function() {
            [].fst();
        }).toThrow();
    });
});

describe('Array.prototype.snd', function() {

    it('should return second element', function() {
        var got = [1, 2, 3].snd();
        expect(got).toEqual(2);
    });

    it('should throw when array is too short', function() {
        expect(function() {
            [1].snd();
        }).toThrow();
    });
});

describe('Array.prototype.trd', function() {

    it('should return third element', function() {
        var got = [1, 2, 3].trd();
        expect(got).toEqual(3);
    });

    it('should throw when array is too short', function() {
        expect(function() {
            [1, 2].trd();
        }).toThrow();
    });
});

describe('Array.prototype.take', function() {

    it('should return first n elements', function() {
        var got = [1, 2, 3].take(2);
        expect(got).toEqual([1, 2]);
    });

    it('should throw when taking more elements than array length', function() {
        expect(function() {
            [1].take(2);
        }).toThrow();
    });
});

describe('Array.prototype.drop', function() {

    it('should drop first n elements', function() {
        var got = [1, 2, 3].drop(2);
        expect(got).toEqual([3]);
    });

    it('should throw when dropping more elements than array length', function() {
        expect(function() {
            [1].drop(2);
        }).toThrow();
    });
});

describe('Array.zipl', function() {

    it('should zip using longest array', function() {
        var longest = [1, 2, 3];
        var shortest = ['a'];
        var got = Array.zipl(longest, shortest);
        expect(got).toEqual([[1, 'a'], [2, undefined], [3, undefined]]);
    });
});

describe('Array.zips', function() {

    it('should zip using shortest array', function() {
        var longest = [1, 2, 3];
        var shortest = ['a'];
        var got = Array.zips(longest, shortest);
        expect(got).toEqual([[1, 'a']]);
    });
});

describe('Array.iota', function() {

    it('should generate a sequence of 3 elements', function() {
        var got = Array.iota(3, 1, 1);
        expect(got).toEqual([1, 2, 3]);
    });

    it('should generate a sequence using a step', function() {
        var got = Array.iota(3, 1, 2);
        expect(got).toEqual([1, 3, 5]);
    });

    it('should generate a sequence using a start value', function() {
        var got = Array.iota(3, 10, 2);
        expect(got).toEqual([10, 12, 14]);
    });
});

describe('Array.prototype.iota', function() {

    it('should generate a sequence of length elements', function() {
        var got = [1, 2, 3].iota(1, 1);
        expect(got).toEqual([1, 2, 3]);
    });

    it('should generate a sequence with a step', function() {
        var got = [1, 2, 3].iota(1, 3);
        expect(got).toEqual([1, 4, 7]);
    });

    it('should generate a sequence with a start value', function() {
        var got = [1, 2, 3].iota(10, 3);
        expect(got).toEqual([10, 13, 16]);
    });
});

describe('Array.prototype.flatten', function() {

    it('should flatten nested arrays', function() {
        var got = [[1, 2], [3, 4]].flatten();
        expect(got).toEqual([1, 2, 3, 4]);
    });

    it('cannot flatten mixed array/values array', function() {
        expect(function() {
            [1].flatten();
        }).toThrow();
    });

    it('should flatten only first nesting level', function() {
        var got = [[[1, 2]]].flatten();
        expect(got).toEqual([[1, 2]]);
    });
});










