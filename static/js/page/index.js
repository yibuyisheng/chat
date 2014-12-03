require([
        'socketio',
        'js/module/message-middleware',
        'js/common/url',
        'js/common/directives',
        'bootstrap',
        'angular'
    ],
    function(
        io,
        messageMiddleware,
        url
    ) {
        angular.module('index', ['directivesModule']).controller('IndexController', [
            '$scope',
            '$http',
            function(
                $scope,
                $http
            ) {
                $scope.user = page.user;

                // 初始化获取消息
                $http.get('/get-messages-ajax?chatroom_id=1&token=' + $scope.user.token).then(function(result) {
                    $scope.messages = result.data;
                });

                // socket连接
                var socket = io();
                socket.on('connect', function(message) {
                    $scope.send = function() {
                        var msg = messageMiddleware.setMessage($scope.message).go().getMessage();
                        socket.emit('chat message', JSON.stringify({
                            content: msg,
                            datetime: new Date().getTime(),
                            token: $scope.user.token,
                            chatroomId: 1
                        }));
                    };

                    socket.on('chat message', function(message) {
                        console.log('chat message from server', message);
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