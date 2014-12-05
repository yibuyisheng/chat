var jwt = require('jwt-simple');

var secret = 'chat';
var userValidatePaths = ['/index', '/get-messages-ajax', '/chatroom-ajax', '/find-friends-ajax'];
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
            this.user = decode(this.request.query.token);
            this.token = this.request.query.token;
            yield next;
        } catch (e) {
            this.throw(403, '请登录');
        }
    }

    yield next;
}

module.exports = {
    decode: decode,
    encode: encode,
    koaJwt: koaJwt
};