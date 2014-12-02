var koa = require('koa');
var Router = require('koa-router');
var mount = require('koa-mount');
var http = require('http');
var socketio = require('socket.io');
var jade = require('koa-jade');
var serve = require('koa-static');

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
    socket.on('chat message', function() {
        console.log('chat message from client:', arguments);
        socket.emit('chat message', '我收到了你的消息');
    });
});
server.listen(3000);
