require([
        'socketio',
        'js/module/message-middleware',
        'js/common/url',
        'js/common/directives',
        'js/common/services',
        'bootstrap',
        'angular'
    ],
    function(
        io,
        messageMiddleware,
        url
    ) {
        angular.module('index', ['directivesModule', 'servicesModule']).controller('IndexController', [
            '$scope',
            '$http',
            'safeApply',
            function(
                $scope,
                $http,
                safeApply
            ) {
                $scope.user = page.user;

                // 初始化获取消息
                $http.get('/get-messages-ajax?chatroom_id=1&token=' + $scope.user.token).then(function(result) {
                    $scope.messages = result.data;
                });

                // socket连接
                var socket = io('/?token=' + $scope.user.token);
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
                        var data = $.parseJSON(message);
                        safeApply($scope, function() {
                            $scope.messages.push(data);
                        });
                        // console.log('chat message from server', message);
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