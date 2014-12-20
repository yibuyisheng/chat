var db = require('../db/database.js');
var format = require('nodejs-lib').format;

module.exports = {
    findMemberIds: findMemberIds,
    findRoomsByUser: findRoomsByUser,
    searchRooms: searchRooms,
    getRoomById: getRoomById
};

function findMemberIds(chatroomId) {
    var sql = "select user_id from chat.chatroom_user where chatroom_id=" + chatroomId;
    return db.executeSql(sql);
}

function findRoomsByUser(userId) {
    var sql = format([
        "select cr.* from chat.chatroom cr ",
        "inner join chat.chatroom_user cu on cu.chatroom_id=cr.id",
        "where cu.user_id={0}"
    ].join(' '), userId);
    return db.executeSql(sql).then(function(result) {
        return result[0];
    });
}

function searchRooms(name) {
    var sql = format("select * from chat.chatroom where name like '%{0}%' and type=2", name);
    return db.executeSql(sql).then(function(result) {
        return result[0];
    });
}

function getRoomById(roomId) {
    var sql = "select * from chat.chatroom where id=" + roomId;
    return db.executeSql(sql).then(function(result) {
        if (result[0].length !== 1) {
            throw new Error('不存在');
        }
        return result[0][0];
    });
}