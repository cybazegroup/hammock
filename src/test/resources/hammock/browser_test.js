describe('browser.details.isInternetExplorer', function () {

    it('should accept IE6', function () {
        var got = browser.details.isInternetExplorer('Mozilla/4.0 (compatible; MSIE 6.0b; Windows NT 5.0)');
        expect(got).toEqual(true);
    });

    it('should accept IE8', function () {
        var got = browser.details.isInternetExplorer('Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 5.1; SLCC1; .NET CLR 1.1.4322)');
        expect(got).toEqual(true);
    });

    it('should accept IE11', function () {
        var got = browser.details.isInternetExplorer('Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko');
        expect(got).toEqual(true);
    });

    it('should reject Opera', function () {
        var got = browser.details.isInternetExplorer('Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.0) Opera 12.14');
        print("MANDI", got)
        expect(got).toEqual(false);
    });

    it('should reject Chrome', function () {
        var got = browser.details.isInternetExplorer('Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36');
        expect(got).toEqual(false);
    });

    it('should reject Firefox', function () {
        var got = browser.details.isInternetExplorer('Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0');
        expect(got).toEqual(false);
    });
});
