var browser = { details: {}};

browser.details.isInternetExplorer = function(){
    return !/opera/i.test(navigator.userAgent) && /msie/i.test(navigator.userAgent);
};

browser.redirect = function(loc) {
    if (browser.details.isInternetExplorer() && !/^https?:\/\//.test(loc)) {
        var b = document.getElementsByTagName('base');
        if (b && b[0] && b[0].href) {
            if (b[0].href.substr(b[0].href.length-1) === '/' && loc.charAt(0) === '/')
                loc = loc.substr(1);
            loc = b[0].href + loc;
        }
    }
    location.href = loc;
};

browser.download = function(url){
    if(browser.details.isInternetExplorer()){
        var link = document.createElement('a');
        link.href = url;
        document.body.appendChild(link);
        link.click();
    }else{
        location.href = url;
    }
};

browser.download_url = function(url, filename){
    var link = document.createElement('a');
    link.setAttribute('download', filename);
    link.setAttribute('href', url);
    link.click();    
};

browser.document_styles = function(doc, filter) {
    return Array.prototype.filter.call(doc.styleSheets || [], filter)
    .filter(function(ss) {
        return !!ss.cssRules;
    }).map(function(ss) {
        return Array.prototype.slice.call(ss.cssRules || []);
    }).flatten().filter(function(rule) {
        return !!rule.selectorText;
    }).filter(function(rule) {
        //illustrator has problems with child selectors
        return !rule.selectorText.contains(">");
    }).map(function(rule) {
        return rule.cssText;
    }).join('\n');
};