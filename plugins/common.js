module.exports = {
    buildPath: function(pathFolder, pathRelative) {
        return (pathFolder + pathRelative).replace(/\/{2,}/g, '/');
    }
};