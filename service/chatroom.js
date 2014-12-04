var db = require('../db/database.js');
var format = require('nodejs-lib').format;

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

module.exports = {
    findMemberIds: findMemberIds,
    findRoomsByUser: findRoomsByUser
};