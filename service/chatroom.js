var db = require('../db/database.js');

function findMemberIds(chatroomId) {
    var sql = "select user_id from chat.chatroom_user where chatroom_id=" + chatroomId;
    return db.executeSql(sql);
}

module.exports = {
    findMembers: findMembers
};