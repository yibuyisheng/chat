define(['angular'], function() {
    var servicesModule;
    try {
        servicesModule = angular.module('servicesModule');
    } catch (e) {
        servicesModule = angular.module('servicesModule', []);
    }

    servicesModule.factory('safeApply', [
        '$timeout',
        function(
            $timeout
        ) {
            function executeFn($scope, fn) {
                if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
                    fn instanceof Function && $scope.$apply(fn);
                } else {
                    $timeout(function() {
                        executeFn($scope, fn);
                    });
                }
            }
            return function($scope, fn) {
                executeFn($scope, fn);
            };
        }
    ]);

    return servicesModule;
});