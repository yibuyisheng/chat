define(['angular'], function() {
    var servicesModule;
    try {
        servicesModule = angular.module('servicesModule');
    } catch (e) {
        servicesModule = angular.module('servicesModule', []);
    }

    servicesModule.factory('safeApply', [
        function() {
            return function($scope, fn) {
                if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
                    fn instanceof Function && $scope.$apply(fn);
                }
            };
        }
    ]);

    return servicesModule;
});