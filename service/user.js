var db = require('../db/database.js');
var format = require('nodejs-lib').format;

function validateToken(token) {
    // 暂时将token当成userId
    return db.executeSql('select * from chat.user where id=' + token).then(function(result) {
        return result[0][0];
    });
}

function login(name, password) {
    var sql = format("select * from chat.user where nickname='{0}' or email='{1}'", name, name);
    return db.executeSql(sql).then(function(result) {
        if (result[0].length !== 1) {
            throw new Error('不存在这样的账号');
        }
        return result[0][0];
    }).then(function(user) {
        console.log(user.password, password);
        if (user.password !== password) {
            throw new Error('用户名或密码错误');
        }
        user.token = user.id;
        user.id = null;
        return user;
    });
}

module.exports = {
    validateToken: validateToken,
    login: login
};