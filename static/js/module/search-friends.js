/**
 * 查找并添加好友
 */

define(['js/module/module-helper', 'js/common/utils', 'angular'], function(helper, utils) {
    helper.getModule('moduleModule').directive('searchFriends', [
        '$http',
        function(
            $http
        ) {
            return {
                restrict: 'E',
                scope: {show: '=', alreadyFriends: '=', alreadyRooms: '=', self: '=', token: "=", friendsChange: "&"},
                templateUrl: '/ngtpls/search-friends',
                link: function(scope, element, attrs) {
                    scope.search = function() {
                        var keyword = scope.keyword || '';
                        var url;
                        if (scope.actionType === 0) {
                            url = '/search-friends-ajax?token=' + scope.token + '&keyword=' + keyword;
                        } else {
                            url = '/search-rooms-ajax?token=' + scope.token + '&keyword=' + keyword;
                        }
                        $http.get(url).then(utils.bind(function(actionType, result) {
                            if (actionType === 0) {
                                result.data = utils.filter(result.data, function(item) {
                                    return item.nickname !== scope.self.nickname && !utils.some(scope.alreadyFriends, function(friend) {
                                        return item.nickname === friend.nickname;
                                    });
                                });
                            } else {
                                result.data = utils.filter(result.data, function(item) {
                                    return !utils.some(scope.alreadyRooms, function(room) {
                                        return item.name === room.name;
                                    });
                                });
                            }
                            scope[actionType === 0 ? 'friends' : 'rooms'] = result.data;
                        }, null, scope.actionType));
                    };

                    scope.addFriend = function(friend) {
                        $http.post('/add-friend?token=' + scope.token, {friend_id: friend.id}).then(function() {
                            scope.friendsChange instanceof Function && scope.friendsChange();
                            scope.friends = utils.filter(scope.friends, function(item) {
                                return item.id !== friend.id;
                            });
                            alert('添加成功');
                        });
                    };
                }
            };
        }
    ]);
});