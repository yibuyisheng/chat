var co = require('co');
var compose = require('koa-compose');

var middleware = {
    go: function() {
        var gen = compose(this._genFns);
        var fn = co.wrap(gen);
        fn.call(this);
        return this;
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

module.exports = function(props) {
    return Object.create(middleware, props || {});
}