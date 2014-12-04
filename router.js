// 路由配置

var Router = require('koa-router');
var userService = require('./service/user.js');
var messageService = require('./service/message.js');
var chatroomService = require('./service/chatroom.js');
var parse = require('co-body');

var api = new Router();

api.get('/login', function * () {

    yield this.render('login', {});

}).post('/login-ajax', function * () {

    var data = yield parse.json(this.request);
    try {
        var user = yield userService.login(data.name, data.password);
        this.response.body = JSON.stringify(user);
        this.response.set('Content-Type', 'text/plain');
    } catch (e) {
        this.throw(406, '错误：' + e.message);
    }

}).get('/index', function * () {

    yield this.render('index', {user: this.user, token: this.token});

}).get('/get-messages-ajax', function * () {

    try {
        var messages = yield messageService.getMessagesByChatroom(this.request.query.chatroom_id);
        this.response.body = JSON.stringify(messages);
        this.response.set('Content-Type', 'text/plain');
    } catch (e) {
        this.throw(403, '错误：' + e.message);
    }

}).get('/chatroom-ajax', function * () {

    try {
        var rooms = yield chatroomService.findRoomsByUser(this.user.id);
        this.response.body = JSON.stringify(rooms);
        this.response.set('Content-Type', 'text/plain');
    } catch (e) {
        this.throw(403, '错误：' + e.message);
    }

});

module.exports = api;