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

module.exports = {
    login: login
};