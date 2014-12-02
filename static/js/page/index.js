require(['socketio', 'bootstrap', 'angular'], function(io) {
    angular.module('index', []).controller('IndexController', [
        '$scope',
        function($scope) {
            // socket连接
            var socket = io();
            socket.on('connect', function() {
                $scope.send = function() {
                    socket.emit('chat message', '测试消息发送，收到请回复');
                    socket.on('chat message', function() {
                        console.log('chat message from server', arguments);
                    });
                };
            });
        }
    ]);

    angular.bootstrap(document, ['index']);
});