describe('types.isNumber test',function(){
    it('yields true when input is number',function(){
        var result = types.isNumber(1);
        expect(result).toBeTruthy();
    });
    
    it('yields false when input is not a number',function(){
        var result = types.isNumber('1');
        expect(result).toBeFalsy();
    });
    
    it('yields false when input is null',function(){
        var result = types.isNumber(null);
        expect(result).toBeFalsy();
    });
    
    it('yields false when input is undefined',function(){
        var result = types.isNumber(undefined);
        expect(result).toBeFalsy();
    });
    
    it('yields false when input is an object',function(){
        var result = types.isNumber({});
        expect(result).toBeFalsy();
    });
    
    it('yields false when input is an Array',function(){
        var result = types.isNumber([]);
        expect(result).toBeFalsy();
    });
});


