require(['bootstrap', 'angular'], function() {
    angular.module('index', []).controller('IndexController', [
        '$scope',
        function($scope) {

        }
    ]);

    angular.bootstrap(document, ['index']);
});