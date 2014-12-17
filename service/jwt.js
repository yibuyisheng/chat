var jwt = require('jwt-simple');
var parse = require('co-body');

var secret = 'chat';
var userValidatePaths = [
    '/index',
    '/get-messages-ajax',
    '/chatroom-ajax',
    '/find-friends-ajax',
    '/search-friends-ajax',
    '/search-rooms-ajax',
    '/add-friend',
    '/get-room-ajax'
];
function decode(token) {
    return jwt.decode(token, secret);
}
function encode(object) {
    return jwt.encode(object, secret);
}
function * koaJwt(next) {
    var _this = this;

    var has = userValidatePaths.some(function(path) {
        return path === _this.request.path;
    });
    if (has) {
        try {
            var token = this.request.query.token;
            this.user = decode(token);
            this.token = token;
        } catch (e) {
            this.throw(403, '请登录');
            return;
        }
        yield next;
    }

    yield next;
}

module.exports = {
    decode: decode,
    encode: encode,
    koaJwt: koaJwt
};