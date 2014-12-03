require([
        'socketio',
        'js/module/message-middleware',
        'js/common/directives',
        'bootstrap',
        'angular'
    ],
    function(
        io,
        messageMiddleware
    ) {
        angular.module('index', ['directivesModule']).controller('IndexController', [
            '$scope',
            function($scope) {
                // socket连接
                var socket = io();
                socket.on('connect', function(message) {
                    $scope.send = function() {
                        var msg = messageMiddleware.setMessage($scope.message).go().getMessage();
                        socket.emit('chat message', JSON.stringify({
                            content: msg,
                            token: 1,
                            chatroomId: 1,
                            fromUserId: 1
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