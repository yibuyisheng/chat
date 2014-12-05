define(['angular'], function() {
    function getModule(moduleName, deps) {
        try {
            var module = angular.module(moduleName);
        } catch (e) {
            module = angular.module(moduleName, deps || []);
        }
        return module;
    }

    return {
        getModule: getModule
    };
});