var browser = {details: {}};

browser.details.isInternetExplorer = function() {
    return !/opera/i.test(navigator.userAgent) && /msie/i.test(navigator.userAgent);
};

browser.redirect = function(loc) {
    if (browser.details.isInternetExplorer() && !/^https?:\/\//.test(loc)) {
        var b = document.getElementsByTagName('base');
        if (b && b[0] && b[0].href) {
            var basepath = b[0].href;
            if (b[0].href.substr(b[0].href.length - 1) === '/' && loc.charAt(0) === '/') {
                var basepathParts = basepath.split('/');
                basepath = "{0}//{2}/".template(basepathParts);
                loc = loc.substr(1);
            }
            loc = basepath + loc;
        }
    }
    location.href = loc;
};

browser.download = function(url) {
    if (browser.details.isInternetExplorer()) {
        var link = document.createElement('a');
        link.href = url;
        document.body.appendChild(link);
        link.click();
    } else {
        location.href = url;
    }
};

browser.download_url = function (url, filename) {
    var link = document.createElement('a');
    link.setAttribute('download', filename);
    link.setAttribute('href', url);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

browser.download_data = function (data, filename, /*optional*/ docType, /*optional*/ charset) {
    var link = document.createElement('a');
    var model = {
        docType: docType || 'text/plain',
        charset: charset || 'utf-8',
        data: encodeURIComponent(data)
    };
    link.setAttribute('href', 'data:{docType};charset={charset},{data}'.template(model));
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

browser.document_styles = function(doc, styleSheetFilter, ruleFilter) {
    return Array.prototype.filter.call(doc.styleSheets || [], styleSheetFilter || always).filter(function(ss) {
        return !!ss.cssRules;
    }).flatMap(function(ss) {
        return Array.prototype.slice.call(ss.cssRules || []);
    }).filter(function(rule) {
        return !!rule.selectorText;
    }).filter(function(rule) {
        //illustrator has problems with child selectors
        return !rule.selectorText.contains(">");
    }).filter(ruleFilter || always).map(function(rule) {
        return rule.cssText;
    }).join('\n');
};
