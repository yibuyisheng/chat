var config = require('./config');
var router = require('./router');

var StaticManager = require('./plugins/static');
var TemplateManager = require('./plugins/template');
var app = require('koa')();

var staticManager = new StaticManager(config['static']);
var templateManager = new TemplateManager(config.templates);


app.use(function * () {
    if (/^\/static/.test(this.request.path)) {
        if (/js$/i.test(this.request.path)) {
            this.type = 'application/javascript';
        }
        this.body = staticManager.createReadStream(this.request.path.replace('static', ''));
    } else {
        var routerObj = router[this.request.path];
        console.log(this.request.path);
        if (!routerObj) {
            this.status = 404;
        } else {
            this.type = routerObj.contentType;

            var parameters;
            if (routerObj.controller instanceof Function) {
                parameters = routerObj.controller.call(this, routerObj);
            }

            this.body = yield templateManager.render(routerObj.template, parameters);
        }
    }
});

var server = require('http').createServer(app.callback());
var io = require('socket.io')(server);
io.on('connection', function() { /* … */ });
server.listen(3000);