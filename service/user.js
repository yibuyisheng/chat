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
    if (!password || !passwordRegExp.test(nickname)) {
        throw new Error('密码只能由字母或数字组成，长度是6到20个字符。');
    }
}
function validateEmail(email) {
    if (!email || !emailRegExp.test(nickname)) {
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
        return user;
    });
}

function findFriends(userId) {
    var sql = format([
        "select u.* ",
        "from chat.user u ",
        "inner join chat.friend f on ",
            "(u.id=f.user_id_driving and f.user_id_passive={0})",
            "or (u.id=f.user_id_passive and f.user_id_driving={0})"
    ].join(' '), userId);
    console.log('---------------', sql);
    return db.executeSql(sql).then(function(result) {
        return result[0];
    });
}

module.exports = {
    login: login,
    registe: registe,
    findFriends: findFriends
};