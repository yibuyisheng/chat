define(['angular', 'js/common/directives'], function() {
    // 事先创建好需要的module，同时依赖关系也在此处体现
    angular.module('moduleModule', ['directivesModule']);

    function getModule(moduleName) {
        try {
            var module = angular.module(moduleName);
        } catch (e) {
            module = angular.module(moduleName, []);
        }
        return module;
    }

    return {
        getModule: getModule
    };
});