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
                socket.on('connect', function() {
                    socket.on('chat message', function() {
                        console.log('chat message from server', arguments);
                    });

                    $scope.send = function() {
                        var msg = messageMiddleware.setMessage($scope.message).go().getMessage();
                        socket.emit('chat message', msg);
                    };
                });
            }
        ]);

        angular.bootstrap(document, ['index']);
    }
);