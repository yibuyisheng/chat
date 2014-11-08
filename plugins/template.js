// 模板管理器

module.exports = TemplateManager;

var fs = require('fs');
var common = require('./common');

function TemplateManager(folder) {
    this.folder = folder;
}

TemplateManager.prototype.render = function(relativePath, parameters) {
    var _this = this;
    return function(callback) {
        fs.readFile(common.buildPath(_this.folder, relativePath), callback);
    };
};