var co = require('co');
var compose = require('koa-compose');
var extend = require('nodejs-lib').extend;

var middleware = {
    go: function(thisArg) {
        var gen = compose(this._genFns);
        var fn = co.wrap(gen);
        return fn.call(thisArg);
    },
    use: function(genFn) {
        if (genFn instanceof Function) {
            this._genFns = this._genFns || [];
            this._genFns.push(genFn);
        }
        return this;
    },
    clear: function() {
        this._genFns = null;
    }
};

module.exports = function() {
    return extend({}, middleware);
}