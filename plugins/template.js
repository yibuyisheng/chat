// 模板管理器
module.exports = TemplateManager;

var fs = require('fs');
var common = require('./common');
var jade = require('jade');
var co = require('co');
var path = require('path');

function TemplateManager(folder) {
    this._folder = folder;

    // 预编译所有的模板
    this._compiledTemplates = {};
    var _this = this;
    co(function *() {
        var folders = [folder], tmpFiles = [];

        while (folders.length) {
            var tmpFolders = [];
            for (var i = 0, il = folders.length; i < il; i += 1) {
                var tmpFiles = yield function(fn) { fs.readdir(folders[i], fn); };
                for (var j = 0, jl = tmpFiles.length; j < jl; j += 1) {
                    var fullPath = path.join(folders[i], tmpFiles[j]);
                    var stat = (yield function(fn) { fs.stat(fullPath, fn); });
                    if (stat.isFile()) {
                        _this._compiledTemplates[fullPath] = jade.compile(String(yield function(fn) { fs.readFile(fullPath, fn); }));
                    } else if (stat.isDirectory()) {
                        tmpFolders.push(fullPath);
                    }
                }
            }
            folders = tmpFolders;
        }

        console.log(_this._compiledTemplates);

    }).catch(function(error) {
        console.log('initialize fialed: can not initialize templates, error: ', error);
    });

}

TemplateManager.prototype.render = function(relativePath, parameters) {
    var _this = this;

    var fullPath = path.join(this._folder, relativePath);

    return _this._compiledTemplates[fullPath] ?
        _this._compiledTemplates[fullPath](parameters) : jade.renderFile(fullPath, parameters);
};