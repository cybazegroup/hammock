describe('functions.curry', function () {
    it('should force 1st argument', function () {
        var fn = function (first) {
            return first;
        }.curry(1);
        var got = fn();
        expect(got).toEqual(1);
    });
});

describe('functions.rcurry', function () {
    it('should force last argument', function () {
        var fn = function (_, second) {
            return second;
        }.rcurry(1);
        var got = fn(0);
        expect(got).toEqual(1);
    });
});

describe('functions.pcurry', function () {
    it('should force nth argument', function () {
        var fn = function (_, second, _) {
            return second;
        }.pcurry([1, 'z']);
        var got = fn(0, 0);
        expect(got).toEqual('z');
    });
});

describe('functions.bind', function () {
    it('fn should be bound to object', function () {
        var data = {secret: 'z'};
        var fn = function () {
            return this.secret;
        }.bind(data);
        expect(fn()).toEqual('z');
    });
});

describe('functions.flip', function () {
    it('should flip arguments', function () {
        var table = function (first, second) {
            return [first, second];
        };
        var fn = table.flip()
        var got = fn(1, 2);
        expect(got).toEqual([2, 1]);
    });
});

describe('functions.nary', function () {
    it('should force function arity', function () {
        var fn = function () {
            return Array.prototype.slice.call(arguments);
        }.nary(1);
        expect(fn(1, 2, 3, 4)).toEqual([1]);
    });
});

describe('functions.nullary', function () {
    it('should force arity to 0', function () {
        var fn = function () {
            return Array.prototype.slice.call(arguments);
        }.nullary();
        expect(fn(1, 2, 3, 4)).toEqual([]);
    });

    it('should take the correct scope', function () {
        var scope = {secret: 'z'};
        var fn = function () {
            return this.secret;
        }.nullary(scope);
        expect(fn()).toEqual('z');
    });
});

describe('functions.unary', function () {
    it('should force arity to 1', function () {
        var fn = function () {
            return Array.prototype.slice.call(arguments);
        }.unary();
        expect(fn(1, 2, 3, 4)).toEqual([1]);
    });

    it('should take the correct scope', function () {
        var scope = {secret: 'z'};
        var fn = function () {
            return this.secret;
        }.unary(scope);
        expect(fn()).toEqual('z');
    });
});

describe('functions.binary', function () {
    it('should force arity to 2', function () {
        var fn = function () {
            return Array.prototype.slice.call(arguments);
        }.binary();
        expect(fn(1, 2, 3, 4)).toEqual([1, 2]);
    });

    it('should take the correct scope', function () {
        var scope = {secret: 'z'};
        var fn = function () {
            return this.secret;
        }.binary(scope);
        expect(fn()).toEqual('z');
    });
});

describe('functions.ternary', function () {
    it('should force arity to 3', function () {
        var fn = function () {
            return Array.prototype.slice.call(arguments);
        }.ternary();
        expect(fn(1, 2, 3, 4)).toEqual([1, 2, 3]);
    });

    it('should take the correct scope', function () {
        var scope = {secret: 'z'};
        var fn = function () {
            return this.secret;
        }.ternary(scope);
        expect(fn()).toEqual('z');
    });
});

describe('functions.interceptor', function () {
    it('should intercept passed parameters', function () {
        var got = {};
        var fn = noop.intercept(function () {
            got.spied = arguments[1];
        });
        fn(1, 2, 3);
        expect(got.spied).toEqual([1, 2, 3]);
    });

    it('can be applied to different scope', function () {
        var scope = {secret: 'z'};
        var got = {};
        var fn = noop.intercept(function () {
            got.spied = arguments[1].concat(this.secret);
        }, scope);
        fn(1, 2, 3);
        expect(got.spied).toEqual([1, 2, 3, 'z']);
    });
});

describe('functions.and_then', function () {
    it('second fn should be called after first', function () {
        var init = function () {
            return 2;
        };
        var add = function (e) {
            return e / 2;
        };
        var fn = init.and_then(add);
        expect(fn(0)).toEqual(1);
    });

    it('can be applied to different scope', function () {
        var scope = {secret: 2};
        var init = function () {
            return 0;
        };
        var add = function (e) {
            return this.secret / 2;
        };
        var fn = init.and_then(add, scope);
        expect(fn()).toEqual(1);
    });
});

describe('functions.preceded_by', function () {
    it('first fn should be called after second', function () {
        var init = function () {
            return 2;
        };
        var add = function (e) {
            return e / 2;
        };
        var fn = add.preceded_by(init);
        expect(fn(0)).toEqual(1);
    });

    it('can be applied to different scope', function () {
        var scope = {secret: 2};
        var init = function () {
            return this.secret;
        };
        var add = function (e) {
            return e / 2;
        };
        var fn = add.preceded_by(init, scope);
        expect(fn()).toEqual(1);
    });
});

describe('functions.when', function () {
    it('fn should be called when condition is met', function () {
        var add = function (e) {
            return e + 1;
        };
        var fn = add.when(function (e) {
            return e === 0;
        });
        expect(fn(0)).toEqual(1);
    });

    it('fn should not be called when condition is not met', function () {
        var add = function (e) {
            return e + 1;
        };
        var fn = add.when(function (e) {
            return e !== 0;
        });
        expect(fn(0)).toEqual(undefined);
    });

    it('can be applied to different scope', function () {
        var scope = {secret: true};
        var add = function (e) {
            return this.secret;
        };
        var predicate = function (e) {
            return this.secret;
        };
        var fn = add.when(predicate, scope);
        expect(fn()).toEqual(true);
    });
});

describe('functions.unless', function () {
    it('fn should be called when condition is not met', function () {
        var add = function (e) {
            return e + 1;
        };
        var fn = add.unless(function (e) {
            return e !== 0;
        });
        expect(fn(0)).toEqual(1);
    });

    it('fn should not be called when condition is met', function () {
        var add = function (e) {
            return e + 1;
        };
        var fn = add.unless(function (e) {
            return e === 0;
        });
        expect(fn(0)).toEqual(undefined);
    });

    it('can be applied to different scope', function () {
        var scope = {secret: false};
        var add = function (e) {
            return this.secret;
        };
        var predicate = function (e) {
            return this.secret;
        };
        var fn = add.unless(predicate, scope);
        expect(fn()).toEqual(false);
    });
});

describe('functions.meta', function () {
    it('fn can be annotated with metadata', function () {
        var fn = function () {
        };
        fn.meta({a: 1});
        expect(fn['a']).toEqual(1);
    });
});

describe('functions.meta_matches', function () {
    it('fn metadata can be compared with other metadata', function () {
        var fn = function () {
        };
        fn.meta({a: 1});
        expect(fn.meta_matches({a: 1})).toBeTruthy();
    });
});

describe('functions.with_param', function () {
    it('should allow only nth param', function () {
        var fn = function () {
            return Array.prototype.slice.call(arguments);
        }.with_param(1);
        var got = fn(1, 2, 3);
        expect(got).toEqual([2]);
    });
});

describe('functions.with_first_param', function () {
    it('should allow only first param', function () {
        var fn = function () {
            return Array.prototype.slice.call(arguments);
        }.with_first_param(1);
        var got = fn(1, 2, 3);
        expect(got).toEqual([1]);
    });
});

describe('functions.with_second_param', function () {
    it('should allow only second param', function () {
        var fn = function () {
            return Array.prototype.slice.call(arguments);
        }.with_second_param(1);
        var got = fn(1, 2, 3);
        expect(got).toEqual([2]);
    });
});

describe('functions.with_third_param', function () {
    it('should allow only third param', function () {
        var fn = function () {
            return Array.prototype.slice.call(arguments);
        }.with_third_param(1);
        var got = fn(1, 2, 3);
        expect(got).toEqual([3]);
    });
});

describe('functions.slicing_params', function () {
    it('should allow only from nth to mth param', function () {
        var fn = function () {
            return Array.prototype.slice.call(arguments);
        }.slicing_params(0, 2);
        var got = fn(1, 2, 3);
        expect(got).toEqual([1, 2]);
    });
});

describe('functions.not', function () {
    it('should invert true to false', function () {
        var yes = function () {
            return true;
        };
        expect(not(yes)()).toEqual(false);
    });
    it('should invert false to true', function () {
        var no = function () {
            return false;
        };
        expect(not(no)()).toEqual(true);
    });
    it('should apply arguments', function () {
        var eq = function (a, b) {
            return a === b;
        };
        expect(not(eq)(1, 2)).toEqual(true);
    });
});

describe('functions.first_param', function () {
    it('should return first param', function () {
        var wrapper = function (f) {
            return f(1, 2, 3);
        };
        expect(wrapper(first_param)).toEqual(1);
    });
});

describe('functions.second_param', function () {
    it('should return second param', function () {
        var wrapper = function (f) {
            return f(1, 2, 3);
        };
        expect(wrapper(second_param)).toEqual(2);
    });
});

describe('functions.third_param', function () {
    it('should return third param', function () {
        var wrapper = function (f) {
            return f(1, 2, 3);
        };
        expect(wrapper(third_param)).toEqual(3);
    });
});

describe('functions.param', function () {
    it('should return nth param', function () {
        var wrapper = function (f) {
            return f(1, 2, 3);
        };
        expect(wrapper(param(1))).toEqual(2);
    });
});

describe('functions.noop', function () {
    it('should do nothing', function () {
        expect(noop()).toEqual(undefined);
    });
});

describe('functions.identity', function () {
    it('should return input', function () {
        expect(identity(1)).toEqual(1);
    });
});

describe('functions.never', function () {
    it('should return false', function () {
        expect(never()).toEqual(false);
    });
});

describe('functions.always', function () {
    it('should return true', function () {
        expect(always()).toEqual(true);
    });
});

describe('functions.sum', function () {
    it('should add value and accumulator', function () {
        expect(sum(0, 1)).toEqual(1);
    });
});

describe('functions.count', function () {
    it('should retur accumulator + 1', function () {
        expect(count(0)).toEqual(1);
    });
});

describe('functions.is_even', function () {
    it('should return true if value is even', function () {
        expect(is_even(2)).toBeTruthy();
    });

    it('should return false if value is odd', function () {
        expect(is_even(1)).toBeFalsy();
    });
});

describe('functions.is_odd', function () {
    it('should return false if value is even', function () {
        expect(is_odd(2)).toBeFalsy();
    });

    it('should return true if value is odd', function () {
        expect(is_odd(1)).toBeTruthy();
    });
});

describe('functions.is_true', function () {
    it('should return true if value is true', function () {
        expect(is_true(true)).toBeTruthy();
    });

    it('should return false if value is false', function () {
        expect(is_true(false)).toBeFalsy();
    });
});

describe('functions.is_false', function () {
    it('should return false if value is true', function () {
        expect(is_false(true)).toBeFalsy();
    });

    it('should return true if value is false', function () {
        expect(is_false(false)).toBeTruthy();
    });
});

describe('functions.is', function () {
    it('should return true if strict equality evaluates true', function () {
        expect(is(1, 1)).toBeTruthy();
    });

    it('should return false if strict equality evaluates false ', function () {
        expect(is(1, '1')).toBeFalsy();
    });
});

describe('functions.eq', function () {
    it('should return true if equality evaluates true', function () {
        expect(eq(1, 1)).toBeTruthy();
    });

    it('should return true if equality evaluates true after cast', function () {
        expect(eq(1, '1')).toBeTruthy();
    });

    it('should return false if equality evaluates false ', function () {
        expect(eq(1, 2)).toBeFalsy();
    });
});

describe('functions.lt', function () {
    it('should return true if lhs < rhs', function () {
        expect(lt(0, 1)).toBeTruthy();
    });

    it('should return false if lhs == rhs', function () {
        expect(lt(0, 0)).toBeFalsy();
    });

    it('should return false if lhs > rhs', function () {
        expect(lt(1, 0)).toBeFalsy();
    });
});

describe('functions.gt', function () {
    it('should return true if lhs > rhs', function () {
        expect(gt(1, 0)).toBeTruthy();
    });

    it('should return false if lhs == rhs', function () {
        expect(gt(0, 0)).toBeFalsy();
    });

    it('should return false if lhs < rhs', function () {
        expect(gt(0, 1)).toBeFalsy();
    });
});

describe('functions.lte', function () {
    it('should return true if lhs < rhs', function () {
        expect(lte(0, 1)).toBeTruthy();
    });

    it('should return true if lhs == rhs', function () {
        expect(lte(0, 0)).toBeTruthy();
    });

    it('should return false if lhs > rhs', function () {
        expect(lte(1, 0)).toBeFalsy();
    });
});

describe('functions.gte', function () {
    it('should return true if lhs > rhs', function () {
        expect(gte(1, 0)).toBeTruthy();
    });

    it('should return true if lhs == rhs', function () {
        expect(gte(0, 0)).toBeTruthy();
    });

    it('should return false if lhs < rhs', function () {
        expect(gte(0, 1)).toBeFalsy();
    });
});


