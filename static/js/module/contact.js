/**
 * 联系人
 */
define(['js/module/helper'], function(helper) {
    helper.getModule('moduleModule').directive('contact', [
        '$http',
        function(
            $http
        ) {
            return {
                restrict: 'E',
                scope: {'token': '=token'},
                templateUrl: '/ngtpls/contact',
                link: function(scope, element, attrs) {
                    // 根据token获取用户的好友列表
                    scope.$watch('token', function(newToken) {
                        $http.get('/find-friends-ajax?token=' + scope.token).then(function(result) {
                            scope.friends = result.data;
                        });
                    });
                }
            };
        }
    ]);
});