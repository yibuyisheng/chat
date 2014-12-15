var gulp = require('gulp');
var exec = require('child_process').exec;

gulp.task('supervisor', function() {
    var childProcess;
    gulp.watch([
        '*.js',
        'common/**/*.js',
        'db/**/*.js',
        'plugins/**/*.js',
        'service/**/*.js',
        'templates/**/*.jade'
    ], function() {
        if (childProcess) {
            process.kill(childProcess.pid, 'SIGHUP');
        }
        childProcess = exec('node --harmony server.js');
    });
});
gulp.task('develop', function() {
  // place code for your default task here
});