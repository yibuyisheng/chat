var db = require('../db/database.js');
var format = require('nodejs-lib').format;
var dateFormat = require('nodejs-lib').dateFormat;
var chatroomService = require('./chatroom.js');

module.exports = {
    parse: parse,
    getMessagesByChatroom: getMessagesByChatroom
};

function saveMessage(fromUserId, chatroomId, content, sendDate) {
    var sql = format(
        "insert into chat.message(content, from_user_id, chatroom_id, send_date) values('{0}', {1}, {2}, '{3}')",
        content, fromUserId, chatroomId, dateFormat(new Date(sendDate), 'yyyy-MM-dd HH:mm:ss')
    );
    return db.executeSql(sql);
}

function parse(messageData) {
    var chatroomId = messageData.chatroomId;
    return saveMessage(
        messageData.fromUserId,
        messageData.chatroomId,
        messageData.content,
        messageData.datetime
    ).then(function(result) {
        var sql = format([
            "select m.id, m.from_user_id,",
                "u.avatar from_user_avatar, u.nickname from_user_nickname,",
                "group_concat(cast(cu.id as char)) user_ids",
            "from chat.message m",
            "inner join chat.chatroom_user cu on m.chatroom_id=cu.chatroom_id",
            "inner join chat.user u on u.id=m.from_user_id",
            "where m.id={0}",
            "group by m.id order by send_date asc"
        ].join(' '), result[0].insertId);
        return db.executeSql(sql);
    }).then(function(result) {
        return {
            userIds: result[0][0].user_ids.split(',').map(function(id) {return parseInt(id);}),
            chatroomId: messageData.chatroomId,
            content: messageData.content,
            send_date: messageData.datetime,
            from_user_id: result[0][0].from_user_id,
            from_user_avatar: result[0][0].from_user_avatar,
            from_user_nickname: result[0][0].from_user_nickname
        };
    }).catch(function(e) {
        console.log(e.stack);
    });
}

function getMessagesByChatroom(chatroomId) {
    var sql = format([
        "select m.id, m.content, m.send_date, m.from_user_id, u.avatar from_user_avatar, u.nickname from_user_nickname",
        "from chat.message m",
        "inner join chat.user u on u.id=m.from_user_id",
        "where m.chatroom_id={0}",
        "group by m.id order by send_date asc"
    ].join(' '), chatroomId);

    return db.executeSql(sql).then(function(result) {
        return result[0];
    });
}