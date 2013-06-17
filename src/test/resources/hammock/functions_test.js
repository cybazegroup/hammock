describe('functions.curry', function() {
    it('should force 1st argument', function() {
        var fn = function(first) {
            return first;
        }.curry(1);
        var got = fn(); 
        expect(got).toEqual(1);
    });
});

describe('functions.rcurry', function() {
    it('should force last argument', function() {
        var fn = function(_, second) {
            return second;
        }.rcurry(1);
        var got = fn(0); 
        expect(got).toEqual(1);
    });
});

describe('functions.pcurry', function() {
    it('should force nth argument', function() {
        var fn = function(_, second, _) {
            return second;
        }.pcurry([1, 'z']);
        var got = fn(0, 0); 
        expect(got).toEqual('z');
    });
});

describe('functions.bind', function() {
    it('fn should be bound to object', function() {
        var data = {secret: 'z'};
        var fn = function() {
            return this.secret;
        }.bind(data);
        expect(fn()).toEqual('z');
    });
});

describe('functions.nary', function() {
    it('should force function arity', function() {
        var fn = function() {
            return Array.prototype.slice.call(arguments);
        }.nary(1);
        expect(fn(1, 2, 3, 4)).toEqual([1]);
    });
});

describe('functions.nullary', function() {
    it('should force arity to 0', function() {
        var fn = function() {
            return Array.prototype.slice.call(arguments);
        }.nullary();
        expect(fn(1, 2, 3, 4)).toEqual([]);
    });
});

describe('functions.unary', function() {
    it('should force arity to 1', function() {
        var fn = function() {
            return Array.prototype.slice.call(arguments);
        }.unary();
        expect(fn(1, 2, 3, 4)).toEqual([1]);
    });
});

describe('functions.binary', function() {
    it('should force arity to 2', function() {
        var fn = function() {
            return Array.prototype.slice.call(arguments);
        }.binary();
        expect(fn(1, 2, 3, 4)).toEqual([1, 2]);
    });
});

describe('functions.ternary', function() {
    it('should force arity to 3', function() {
        var fn = function() {
            return Array.prototype.slice.call(arguments);
        }.ternary();
        expect(fn(1, 2, 3, 4)).toEqual([1, 2, 3]);
    });
});

describe('functions.interceptor', function() {
    it('should intercept passed parameters', function() {
        var got = {};
        var fn = noop.intercept(function() {
            got.spied = arguments[1];
        });
        fn(1, 2, 3);
        expect(got.spied).toEqual([1, 2, 3]);
    });
    
    it('can be applied to different scope', function() {
        var scope = {secret: 'z'};
        var got = {};
        var fn = noop.intercept(function() {
            got.spied = arguments[1].concat(this.secret);
        }, scope);
        fn(1, 2, 3);
        expect(got.spied).toEqual([1, 2, 3, 'z']);
    });
});

describe('functions.and_then', function() {
    it('second fn should be called after first', function() {
        var init = function() {return 2; };
        var add = function(e) {return e / 2; };
        var fn = init.and_then(add);
        expect(fn(0)).toEqual(1);
    });
    
    it('can be applied to different scope', function() {
        var scope = {secret: 2};
        var init = function() {return 0; };
        var add = function(e) {return this.secret / 2; };
        var fn = init.and_then(add, scope);
        expect(fn()).toEqual(1);
    });
});

describe('functions.preceded_by', function() {
    it('first fn should be called after second', function() {
        var init = function() {return 2; };
        var add = function(e) {return e / 2; };
        var fn = add.preceded_by(init);
        expect(fn(0)).toEqual(1);
    });
    
    it('can be applied to different scope', function() {
        var scope = {secret: 2};
        var init = function() {return this.secret; };
        var add = function(e) {return e / 2; };
        var fn = add.preceded_by(init, scope);
        expect(fn()).toEqual(1);
    });
});

describe('functions.when', function() {
    it('fn should be called when condition is met', function() {
        var add = function(e) {return e + 1; };
        var fn = add.when(function(e) {return e === 0; });
        expect(fn(0)).toEqual(1);
    });
    
    it('fn should not be called when condition is not met', function() {
        var add = function(e) {return e + 1; };
        var fn = add.when(function(e) {return e !== 0; });
        expect(fn(0)).toEqual(undefined);
    });
    
    it('can be applied to different scope', function() {
        var scope = {secret: true};
        var add = function(e) {return this.secret; };
        var predicate = function(e) {return this.secret; };
        var fn = add.when(predicate, scope);
        expect(fn()).toEqual(true);
    });
});

