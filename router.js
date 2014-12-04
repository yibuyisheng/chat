// 路由配置

var Router = require('koa-router');
var userService = require('./service/user.js');
var messageService = require('./service/message.js');
var chatroomService = require('./service/chatroom.js');

var api = new Router();

api.get('/index', function * () {
    var token = this.request.query.token;
    try {
        var user = yield userService.validateToken(token);
        yield this.render('index', {user: user});
    } catch (e) {
        console.log(e.stack);
        this.response.redirect('/login');
    }
}).get('/login', function * () {
    yield this.render('login', {});
}).post('/login-ajax', function * () {
    var data = yield parse.json(this.request);
    try {
        var user = yield userService.login(data.name, data.password);
        this.response.body = JSON.stringify(user);
        this.response.set('Content-Type', 'text/plain');
    } catch (e) {
        this.response.body = e.message;
        this.response.status = 406;
    }
}).get('/get-messages-ajax', function * () {
    try {
        yield userService.validateToken(this.request.query.token);
        var messages = yield messageService.getMessagesByChatroom(this.request.query.chatroom_id);
        this.response.body = JSON.stringify(messages);
        this.response.set('Content-Type', 'text/plain');
    } catch (e) {
        this.response.body = '错误：' + e.message;
        this.response.status = 403;
    }
}).get('/chatroom-ajax', function * () {
    try {
        var user = yield userService.validateToken(this.request.query.token);
        var rooms = yield chatroomService.findRoomsByUser(user.id);
        this.response.body = JSON.stringify(rooms);
        this.response.set('Content-Type', 'text/plain');
    } catch (e) {
        console.log('------------', e.stack);
        this.response.body = '错误：' + e.message;
        this.response.status = 403;
    }
});

module.exports = api;