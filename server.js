var koa = require('koa');
var Router = require('koa-router');
var mount = require('koa-mount');
var http = require('http');
var socketio = require('socket.io');
var jade = require('koa-jade');

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
).use(mount('/', api.middleware()));

var server = http.createServer(app.callback());
var io = socketio(server);

io.on('connection', function() {
    // TODO
});
server.listen(3000);