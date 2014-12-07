require([
        'bootstrap',
        'angular',
        'js/common/directives'
    ], function(

    ) {
        angular.module('login', ['directivesModule']).controller('LoginController', [
            '$scope',
            '$http',
            function(
                $scope,
                $http
            ) {
                $scope.login = function() {
                    $http.post('/login-ajax', {name: $scope.name, password: $scope.password}).then(function(result) {
                        window.location.href = '/index?token=' + result.data.token;
                    }).catch(function(error) {
                        alert(error.data ? error.data : error.message);
                    });
                };
            }
        ]);

        angular.bootstrap(document, ['login']);
    }
);