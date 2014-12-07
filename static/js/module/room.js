define([
    'js/module/module-helper',
    'js/common/utils',
    'angular'
], function(
    helper,
    utils
) {
    helper.getModule('moduleModule').factory('roomFactory', [
        '$http',
        '$q',
        function(
            $http,
            $q
        ) {
            var rooms = [];
            function getRoomById(token, roomId) {
                var deferred = $q.defer();

                var room = utils.filter(rooms, function(room) {
                    return room.id === roomId;
                })[0];
                if (room) {
                    deferred.resolve(room);
                } else {
                    $http.get('/get-room-ajax?token=' + token + '&room_id=' + roomId).then(function(result) {
                        rooms.push(result.data);
                        deferred.resolve(result.data);
                    }, deferred.reject);
                }

                return deferred.promise;
            }

            return {
                getRoomById: getRoomById
            };
        }
    ]);
});