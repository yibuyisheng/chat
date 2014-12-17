// 路由配置

var Router = require('koa-router');
var userService = require('./service/user.js');
var messageService = require('./service/message.js');
var chatroomService = require('./service/chatroom.js');
var parse = require('co-body');
var path = require('path');
var co = require('co');

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
        console.log(e.stack);
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

    yield common(function * () {
        yield this.render('index', {user: this.user, token: this.token});
    }, this);

}).get('/get-messages-ajax', function * () {

    yield common(function * () {
        var messages = yield messageService.getMessagesByChatroom(this.request.query.chatroom_id);
        this.response.body = JSON.stringify(messages);
        this.response.set('Content-Type', 'text/plain');
    }, this);

}).get('/chatroom-ajax', function * () {

    yield common(function * () {
        var rooms = yield chatroomService.findRoomsByUser(this.user.id);
        this.response.body = JSON.stringify(rooms);
        this.response.set('Content-Type', 'text/plain');
    }, this);

}).get('/find-friends-ajax', function * () {

    yield common(function * () {
        var friends = yield userService.findFriends(this.user.id);
        this.response.body = JSON.stringify(friends);
        this.response.set('Content-Type', 'text/plain');
    }, this);

}).get('/search-friends-ajax', function * () {

    yield common(function * () {
        var friends = yield userService.searchFriends(this.request.query.keyword);
        this.response.body = JSON.stringify(friends);
        this.response.set('Content-Type', 'text/plain');
    }, this);

}).get('/search-rooms-ajax', function * () {

    yield common(function * () {
        var rooms = yield chatroomService.searchRooms(this.request.query.keyword);
        this.response.body = JSON.stringify(rooms);
        this.response.set('Content-Type', 'text/plain');
    }, this);

}).post('/add-friend', function * () {

    yield common(function * () {
        var data = yield parse.json(this.request);
        yield userService.addFriend(this.user.id, data.friend_id);
        this.response.body = '';
        this.response.set('Content-Type', 'text/plain');
    }, this);

}).get('/get-room-ajax', function * () {

    yield common(function * () {
        var roomId = this.request.query.room_id;
        var room = yield chatroomService.getRoomById(roomId);
        this.response.body = JSON.stringify(room);
        this.response.set('Content-Type', 'text/plain');
    }, this);

});

module.exports = api;

function * common (fn, context) {
    try {
        yield fn.call(context);
    } catch (e) {
        console.log(e.stack);
        context.throw(403, '错误：' + e.message);
    }
}