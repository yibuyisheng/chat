require([
        'bootstrap',
        'angular'
    ], function(

    ) {
        angular.module('registe', []).controller('RegisteController', [
            '$scope',
            '$http',
            function(
                $scope,
                $http
            ) {
                $scope.registe = function() {
                    if ($scope.user.password !== $scope.user.confirmPassword) {
                        $scope.alert = {
                            show: true,
                            title: '错误',
                            content: '两次密码输入不一致'
                        };
                        return;
                    }
                    $http.post('/registe-ajax', $scope.user).then(function(result) {
                        console.log(result);
                    }).catch(function(error) {
                        $scope.alert = {
                            show: true,
                            title: '错误',
                            content: error.data ? error.data : error.message
                        };
                    });
                };
            }
        ]);

        angular.bootstrap(document, ['registe']);
    }
);