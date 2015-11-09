var browser = {details: {}, clipboard: {}};

browser.details.isInternetExplorer = function (userAgent) {
    var agent = userAgent || navigator.userAgent;
    return !/opera/i.test(agent) && (
            /msie/i.test(agent) ||
            /trident/i.test(agent) || // IE11
            /edge/i.test(agent) // Microsoft Edge aka Spartan
            );
};

browser.redirect = function (loc) {
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

browser.download = function (url) {
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

browser.document_styles = function (doc, styleSheetFilter, ruleFilter) {
    return Array.prototype.filter.call(doc.styleSheets || [], styleSheetFilter || always).filter(function (ss) {
        return !!ss.cssRules;
    }).flatMap(function (ss) {
        return Array.prototype.slice.call(ss.cssRules || []);
    }).filter(function (rule) {
        return !!rule.selectorText;
    }).filter(function (rule) {
        //illustrator has problems with child selectors
        return !rule.selectorText.contains(">");
    }).filter(ruleFilter || always).map(function (rule) {
        return rule.cssText;
    }).join('\n');
};

browser.clipboard.copy = function (value) {
    var ta = document.createElement('textarea');
    ta.id = 'cliparea';
    ta.style.position = 'absolute';
    ta.style.left = '-1000px';
    ta.style.top = '-1000px';
    ta.value = value;
    document.body.appendChild(ta);
    document.designMode = 'off';
    ta.focus();
    ta.select();
    setTimeout(function () {
        document.body.removeChild(ta);
    }, 100);
};

browser.clipboard.paste = function (callback /*pastedValue*/) {
    var ta = document.createElement('textarea');
    ta.id = 'cliparea';
    ta.style.position = 'absolute';
    ta.style.left = '-1000px';
    ta.style.top = '-1000px';
    document.body.appendChild(ta);
    document.designMode = 'off';
    setTimeout(function () {
        callback.call(this, ta.value);
        document.body.removeChild(ta);
    }, 100);
    ta.focus();
    ta.select();
};
