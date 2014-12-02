/**
 * 插件化中间件
 */

define(function() {
    var middleware = {
        go: function(fn) {
            for (var i = 0, il = this._befores ? this._befores.length : 0; i < il; i += 1) {
                this._befores[i].call(this);
            }
            fn instanceof Function && fn.call(this);
            for (var i = 0, il = this._ends ? this._ends.length : 0; i < il; i += 1) {
                this._ends[i].call(this);
            }
            return this;
        },
        use: function(beforeFn, endFn) {
            if (beforeFn instanceof Function) {
                this._befores = this._befores || [];
                this._befores.push(beforeFn);
            }
            if (endFn instanceof Function) {
                this._ends = this._ends || [];
                this._ends.push(endFn);
            }
            return this;
        }
    };

    return middleware;
});