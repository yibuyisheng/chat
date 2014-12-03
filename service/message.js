var db = require('../db/database.js');
var chatroomService = require('./chatroom.js');

function saveMessage(fromUserId, chatroomId, content) {
    var sql = `insert into chat.message(content, from_user_id, chatroom_id) values('${content}', ${fromUserId}, ${chatroomId})`;
    return db.executeSql(sql);
}

function parse(messageData) {
    var chatroomId = messageData.chatroomId;
    return saveMessage(messageData.fromUserId, messageData.chatroomId, messageData.content).then(function() {
        return chatroomService.findMemberIds(chatroomId);
    }).then(function(result) {
        return {userIds: result[0], chatroomId: chatroomId};
    });
}

module.exports = {
    parse: parse
};