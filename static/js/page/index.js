require([
        'socketio',
        'js/common/middleware',
        'bootstrap',
        'angular'
    ],
    function(
        io,
        middleware
    ) {
        angular.module('index', []).controller('IndexController', [
            '$scope',
            function($scope) {
                // socket连接
                var socket = io();
                socket.on('connect', function() {
                    $scope.send = function() {
                        var messageDealer = $.extend({}, middleware, {msg: '测试消息发送，收到请回复'});
                        socket.emit('chat message', messageDealer.go(function() {
                            this.msg += '; 消息加点内容'
                        }).msg);
                        socket.on('chat message', function() {
                            console.log('chat message from server', arguments);
                        });
                    };
                });
            }
        ]);

        angular.bootstrap(document, ['index']);
    }
);