define(['js/module/module-helper', 'angular'], function(helper) {
    helper.getModule('moduleModule').factory('roomFactory', [
        '$http',
        function(
            $http
        ) {
            function getRoomById(token, roomId) {
                return $http.get('/get-room-ajax?token=' + token + '&room_id=' + roomId).then(function(result) {
                    return result.data;
                });
            }

            return {
                getRoomById: getRoomById
            };
        }
    ]);
});