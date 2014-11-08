// 管理静态文件
module.exports = StaticManager;

var fs = require('fs');
var common = require('./common');

function StaticManager(staticFolder) {
    this.staticFolder = staticFolder;
}

StaticManager.prototype.read = function(relativePath) {
    var _this = this;
    return function(callback) {
        fs.readFile(common.buildPath(_this.staticFolder, relativePath));
    };
};

StaticManager.prototype.createReadStream = function(relativePath) {
    return fs.createReadStream(common.buildPath(this.staticFolder, relativePath));
};