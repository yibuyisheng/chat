require([
        'socketio',
        'js/module/message-middleware',
        'js/common/url',
        'js/common/directives',
        'js/common/services',
        'bootstrap',
        'angular',
        'js/module/contact',
        'js/module/search-friends'
    ],
    function(
        io,
        messageMiddleware,
        url
    ) {
        angular.module('index', ['directivesModule', 'servicesModule', 'moduleModule']).controller('IndexController', [
            '$scope',
            '$http',
            'safeApply',
            function(
                $scope,
                $http,
                safeApply
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

                // 初始化聊天室
                $http.get('/chatroom-ajax?token=' + $scope.token).then(function(result) {
                    $scope.rooms = result.data;
                    $scope.changeRoom($scope.rooms[0]);
                });
                $scope.changeRoom = function(room) {
                    $scope.activeRoom = room;
                    $scope.rooms.forEach(function(room) {
                        room.active = $scope.activeRoom.id === room.id;
                    });
                    getMessages(room.id);
                };

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
            }
        ]);

        angular.bootstrap(document, ['index']);
    }
);