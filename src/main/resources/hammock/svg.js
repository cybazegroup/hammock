objects.namespace('svg');

svg.export_type = {
    svg: { mime_type: 'image/svg+xml'}, 
    png: { mime_type: 'image/png' }, 
    jpg: { mime_type: 'image/jpg'}
};

svg.download = function(filename, export_as, svgTag, stylesFilter) {
    var styles = browser.document_styles(window.document, stylesFilter);
    var stylesTag = document.createElement('style');
    stylesTag.innerHTML = ['<![C', 'DATA[', styles, ']', ']>'].join('');

    var clonedSvg = svgTag.cloneNode(true);
    clonedSvg.setAttribute('width', svgTag.clientWidth);
    clonedSvg.setAttribute('height', svgTag.clientHeight);
    clonedSvg.insertBefore(stylesTag, clonedSvg.firstChild);

    var serialized = new XMLSerializer().serializeToString(clonedSvg);
    var url = window.URL.createObjectURL(new Blob([serialized], {type: "image/svg+xml"}));
    if(export_as.mime_type === "image/svg+xml"){
        browser.download_url(url, filename);
        return;
    }
    var image = new Image;
    image.src = url;
    image.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.setAttribute('width', image.width);
        canvas.setAttribute('height', image.height);
        var context = canvas.getContext("2d");
        context.rect(0,0,image.width,image.height);
        context.fillStyle="white";
        context.fill();
        context.drawImage(image, 0, 0);
        browser.download_url(canvas.toDataURL(export_as.mime_type), filename);
    };        
};