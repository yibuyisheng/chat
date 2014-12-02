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

var app = koa();
var api = new Router();

api.get('/index', function*(next) {
    yield this.render('index', {});
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

io.on('connection', function(socket) {
    socket.on('chat message', function(message) {
        createMiddleware({message: message}).use(function * (next) {
            this.messageData = JSON.parse(this.message);
            yield next;
        }).use(function * (next) {
            if (!userService.validateToken(data.token)) {
                this.status = 0;
            }
            messageService.parse(data);
            yield next;
        }).use(function * () {
            console.log('-------------', this);
        }).go();
        // try {
        //     var data = JSON.parse(message);
        //     if (!userService.validateToken(data.token)) {
        //         return socket.emit('error', '用户验证失败');
        //     }
        //     messageService.parse(data);
        // } catch (e) {
        //     socket.emit('error', '消息数据错误');
        // }

        // socket.emit('chat message', '我收到了你的消息');
    });
});
server.listen(3000);
