// 路由配置

var Router = require('koa-router');
var userService = require('./service/user.js');
var messageService = require('./service/message.js');
var chatroomService = require('./service/chatroom.js');
var parse = require('co-body');
var path = require('path');

var api = new Router();

api.get('/registe', function * () {

    yield this.render('registe');

}).post('/registe-ajax', function * () {

    try {
        var data = yield parse.json(this.request);
        yield userService.registe(data);
        this.response.body = JSON.stringify(data);
        this.response.set('Content-Type', 'text/plain');
    } catch (e) {
        this.throw(406, '错误：' + e.message);
    }

}).get('/login', function * () {

    yield this.render('login');

}).post('/login-ajax', function * () {

    try {
        var data = yield parse.json(this.request);
        var user = yield userService.login(data.name, data.password);
        this.response.body = JSON.stringify(user);
        this.response.set('Content-Type', 'text/plain');
    } catch (e) {
        this.throw(406, '错误：' + e.message);
    }

}).get('/ngtpls/:tpl', function * () {

    yield this.render(path.join('ngtpls', this.params.tpl + '.jade'));

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

}).get('/find-friends-ajax', function * () {

    try {
        var friends = yield userService.findFriends(this.user.id);
        this.response.body = JSON.stringify(friends);
        this.response.set('Content-Type', 'text/plain');
    } catch (e) {
        this.throw(403, '错误：' + e.message);
    }

});

module.exports = api;