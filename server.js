var koa = require('koa');
var Router = require('koa-router');
var mount = require('koa-mount');
var http = require('http');
var socketio = require('socket.io');
var jade = require('koa-jade');
var serve = require('koa-static');
var userService = require('./service/user.js');
var messageService = require('./service/message.js');
var createMiddleware = require('./common/middleware.js');
var parse = require('co-body');

var app = koa();
var api = new Router();

api.get('/index', function * () {
    yield this.render('index', {});
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
});

app.use(
    jade.middleware({
        viewPath: 'templates',
        debug: true,
        pretty: false,
        compileDebug: false
    })
).use(mount('/', api.middleware())).use(mount('/static', serve('static')));

var server = http.createServer(app.callback());
var io = socketio(server);

var sockets = {};
io.on('connection', function(socket) {
    socket.on('chat message', function(message) {
        createMiddleware().use(function * (next) {
            this.messageData = JSON.parse(this.message);
            yield next;
        }).use(function * (next) {
            var user = yield userService.validateToken(this.messageData.token);
            socket.userId = user.id;
            sockets[user.id] = socket;

            this.messageParse = yield messageService.parse(this.messageData);
            yield next;
        }).use(function * (next) {
            var _this = this;
            this.messageParse.userIds.forEach(function(userId) {
                if (!sockets[userId]) return;
                sockets[userId].emit('chat message', JSON.stringify({
                    content: _this.messageParse.content,
                    chatroomId: _this.messageParse.chatroomId
                }));
            });

            yield next;
        }).use(function * () {
            socket.emit('chat message', '消息通过检测');
        }).go({message: message}).catch(function(error) {
            console.log(error.stack);
            socket.emit('chat error', '消息错误：' + error.toString());
        });
    });

    socket.on('disconnect', function() {
        sockets[socket.userId] = null;
    });
});
server.listen(3000);
