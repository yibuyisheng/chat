/**
 * 查找并添加好友
 */

define(['js/module/helper', 'angular'], function(helper) {
    helper.getModule('moduleModule').directive('searchFriends', [
        '$http',
        function(
            $http
        ) {
            return {
                restrict: 'E',
                scope: {show: '=show', token: '=token'},
                templateUrl: '/ngtpls/search-friends',
                link: function(scope, element, attrs) {
                    scope.search = function() {
                        if (scope.actionType === 0) {
                            $http.get('/search-friends-ajax?token=' + scope.token + '&keyword=' + scope.keyword).then(function(result) {
                                scope.friends = result.data;
                            });
                        } else {
                            $http.get('/search-rooms-ajax?token=' + scope.token + '&keyword=' + scope.keyword).then(function(result) {
                                scope.rooms = result.data;
                            });
                        }
                    };
                }
            };
        }
    ]);
});