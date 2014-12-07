var db = require('../db/database.js');
var format = require('nodejs-lib').format;
var jwt = require('./jwt.js');

function login(name, password) {
    var sql = format("select * from chat.user where nickname='{0}' or email='{1}'", name, name);
    return db.executeSql(sql).then(function(result) {
        if (result[0].length !== 1) {
            throw new Error('不存在这样的账号');
        }
        return result[0][0];
    }).then(function(user) {
        if (user.password !== password) {
            throw new Error('用户名或密码错误');
        }
        user.token = jwt.encode(user);
        return user;
    });
}

var nameRegExp = /[a-z|A-Z|0-9|\u4e00-\u9fa5]{1,20}/;
var passwordRegExp = /[a-z|A-Z|0-9]{6,20}/;
var emailRegExp = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
function validateName(name) {
    if (!name || !nameRegExp.test(name)) {
        throw new Error('真实姓名只能由字母、数字或汉字组成，长度是1到20个字符。');
    }
}
function validateNickname(nickname) {
    if (!nickname || !nameRegExp.test(nickname)) {
        throw new Error('昵称只能由字母、数字或汉字组成，长度是1到20个字符。');
    }
}
function validatePassword(password) {
    if (!password || !passwordRegExp.test(password)) {
        throw new Error('密码只能由字母或数字组成，长度是6到20个字符。');
    }
}
function validateEmail(email) {
    if (!email || !emailRegExp.test(email)) {
        throw new Error('邮箱格式不正确。');
    }
}

function registe(user) {
    validateName(user.name);
    validateNickname(user.nickname);
    validatePassword(user.password);
    validateEmail(user.email);

    var sql = format([
        "insert into chat.user(name, nickname, password, email, avatar)",
        "values('{0}', '{1}', '{2}', '{3}', '{4}')"
    ].join(' '), user.name, user.nickname, user.password, user.email, user.avatar);
    return db.executeSql(sql).then(function(result) {
        var sql = "select * from chat.user where id=" + result[0].insertId;
        return db.executeSql(sql);
    }).then(function(result) {
        var user = result[0][0];
        user.token = jwt.encode(user);
        return user;
    });
}

function findFriends(userId) {
    var sql = format([
        "select u.*, cr.id chatroom_id from chat.chatroom_user cu",
        "inner join chat.chatroom_user cu2 on cu.user_id={0} and cu2.chatroom_id=cu.chatroom_id",
        "inner join chat.chatroom cr on cr.id=cu2.chatroom_id and cr.type=1",
        "inner join chat.user u on u.id=cu2.user_id and u.id!={0}"
    ].join(' '), userId);
    return db.executeSql(sql).then(function(result) {
        return result[0];
    });
}

function searchFriends(nickname) {
    var sql = format("select * from chat.user where nickname like '%{0}%'", nickname);
    return db.executeSql(sql).then(function(result) {
        return result[0];
    });
}

function addFriend(selfId, friendId) {
    return db.executeTransaction(function(execute) {
        var sql = format("insert into chat.chatroom(name, type) values('', {0})", 1);
        return execute(sql).then(function(result) {
            var insertId = result[0].insertId;
            sql = format("insert into chat.chatroom_user(user_id, chatroom_id) values({0}, {1}),({2}, {1})", selfId, insertId, friendId);
            return execute(sql);
        });
    });
}

module.exports = {
    login: login,
    registe: registe,
    findFriends: findFriends,
    searchFriends: searchFriends,
    addFriend: addFriend
};