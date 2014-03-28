// Overrides console.log for browsers not supporting it

(function(){
    var global = objects.global();
    if(global.console === undefined){
        global.console = {
            log: noop
        };
    }
})();
