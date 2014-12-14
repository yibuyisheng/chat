define([
    'js/common/middleware',
    'jquery',
    'markdown'
], function(
    middleware,
    $
) {
    var messageMiddleware = $.extend({}, middleware, {
        setMessage: function(msg) {
            this._msg = msg;
            return this;
        },
        getMessage: function() {
            return this._msg
        }
    });

    messageMiddleware.use(function() {
        this.setMessage(markdown.toHTML(this.getMessage()));
    });
    // 一堆对消息进行处理的插件
    // messageMiddleware.use(function() {
    //     var msg = this.getMessage();
    //     msg += 'before1';
    //     this.setMessage(msg);
    // }, function() {
    //     var msg = this.getMessage();
    //     msg += 'after1';
    //     this.setMessage(msg);
    // }).use(function() {
    //     var msg = this.getMessage();
    //     msg += 'before2';
    //     this.setMessage(msg);
    // }, function() {
    //     var msg = this.getMessage();
    //     msg += 'after2';
    //     this.setMessage(msg);
    // });

    return messageMiddleware;
});