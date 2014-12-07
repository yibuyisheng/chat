/**
 * 联系人
 */
define(['js/module/module-helper', 'js/module/room'], function(helper) {
    helper.getModule('moduleModule').directive('contact', [
        '$http',
        'roomFactory',
        function(
            $http,
            roomFactory
        ) {
            return {
                restrict: 'E',
                scope: {friends: '=', currentRoom: '=', token: '='},
                templateUrl: '/ngtpls/contact',
                link: function(scope, element, attrs) {
                    scope.changeRoom = function(friend) {
                        roomFactory.getRoomById(scope.token, friend.chatroom_id).then(function(room) {
                            if (!room.name) {
                                room.name = friend.nickname;
                            }
                            scope.currentRoom = room;
                        });
                    }
                }
            };
        }
    ]);
});