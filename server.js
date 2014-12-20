var koa = require('koa');
var mount = require('koa-mount');
var http = require('http');
var socketio = require('socket.io');
var jade = require('koa-jade');
var serve = require('koa-static');
var userService = require('./service/user.js');
var messageService = require('./service/message.js');
var createMiddleware = require('./common/middleware.js');
var api = require('./router.js');
var jwt = require('./service/jwt.js');
var config = require('./config.js');

var app = koa();

app.use(jwt.koaJwt).use(
    jade.middleware({
        viewPath: 'templates',
        debug: true,
        pretty: false,
        compileDebug: false
    })
).use(
    mount('/', api.middleware())
).use(
    mount('/static', serve('static'))
).on('error', function(error, context) {
    console.log(error.stack);
});

var server = http.createServer(app.callback());
var io = socketio(server);

var sockets = {};
io.on('connection', function(socket) {
    var token = socket.handshake.query.token;
    try {
        var user = jwt.decode(token);
        socket.userId = user.id;
        sockets[user.id] = socket;

        socket.on('chat message', function(message) {
            createMiddleware().use(function * (next) {
                this.messageData = JSON.parse(this.message);
                yield next;
            }).use(function * (next) {
                this.messageData.fromUserId = socket.userId;
                this.messageParse = yield messageService.parse(this.messageData);
                yield next;
            }).use(function * () {
                var _this = this;
                this.messageParse.userIds.forEach(function(userId) {
                    if (!sockets[userId]) return;
                    sockets[userId].emit('chat message', JSON.stringify(_this.messageParse));
                });
            }).go({message: message}).catch(function(error) {
                console.log(error.stack);
                socket.emit('chat error', '消息错误：' + error.toString());
            });
        });
    } catch (e) {
        console.log(e.stack);
        socket.disconnect();
    }

    socket.on('disconnect', function() {
        sockets[socket.userId] = null;
    });
});
server.listen(config.serverPort);
