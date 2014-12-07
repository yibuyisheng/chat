require([
        'socketio',
        'js/module/message-middleware',
        'js/common/url',
        'js/common/utils',
        'js/common/directives',
        'js/common/services',
        'bootstrap',
        'angular',
        'js/module/contact',
        'js/module/search-friends',
        'js/module/room'
    ],
    function(
        io,
        messageMiddleware,
        url,
        utils
    ) {
        angular.module('index', ['directivesModule', 'servicesModule', 'moduleModule']).controller('IndexController', [
            '$scope',
            '$http',
            'safeApply',
            'roomFactory',
            function(
                $scope,
                $http,
                safeApply,
                roomFactory
            ) {
                $scope.user = page.user;
                $scope.token = page.token;
                $scope.messages = {};

                // 获取消息
                function getMessages(chatroomId) {
                    $http.get('/get-messages-ajax?chatroom_id=' + chatroomId + '&token=' + $scope.token).then(function(result) {
                        $scope.messages[chatroomId] = result.data;
                    });
                }

                $scope.$watch('activeRoom', function(newValue, oldValue) {
                    $scope.rooms = $scope.rooms || [];
                    if (oldValue) {
                        $scope.rooms.push(oldValue);
                    }
                    if (newValue) {
                        $scope.rooms.push(newValue);
                    }
                    $scope.rooms = utils.distinctArray($scope.rooms, function(room) {
                        return room.id;
                    });
                });

                // socket连接
                var socket = io('/?token=' + $scope.token);
                socket.on('connect', function(message) {
                    $scope.send = function() {
                        var msg = messageMiddleware.setMessage($scope.message).go().getMessage();
                        socket.emit('chat message', JSON.stringify({
                            content: msg,
                            datetime: new Date().getTime(),
                            token: $scope.token,
                            chatroomId: $scope.activeRoom.id
                        }));
                    };

                    socket.on('chat message', function(message) {
                        var data = $.parseJSON(message);
                        safeApply($scope, function() {
                            $scope.messages[data.chatroomId] = $scope.messages[data.chatroomId] || [];
                            $scope.messages[data.chatroomId].push(data);
                        });
                    });

                    socket.on('chat error', function(message) {
                        console.log(message);
                    });
                });

                // 好友列表
                function getFriends() {
                    $http.get('/find-friends-ajax?token=' + $scope.token).then(function(result) {
                        $scope.friends = result.data;
                    });
                }
                getFriends();
                $scope.getFriends = getFriends;
            }
        ]);

        angular.bootstrap(document, ['index']);
    }
);