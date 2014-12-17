var gulp = require('gulp');
var exec = require('child_process').exec;
var less = require('gulp-less');
var path = require('path');

gulp.task('less', function() {
    gulp.watch(['static/less/**/*.less'], function() {
        gulp.src('static/less/main.less')
            .pipe(less({paths: ['static/less']}))
            .pipe(gulp.dest('static/css'));
    });
});

gulp.task('supervisor', function() {
    var childProcess;
    gulp.watch([
        '*.js',
        'common/**/*.js',
        'db/**/*.js',
        'plugins/**/*.js',
        'service/**/*.js',
        'templates/**/*.jade'
    ], restart);
    restart();

    function restart() {
        if (childProcess) {
            process.kill(childProcess.pid, 'SIGHUP');
        }
        childProcess = exec('node --harmony server.js');
        childProcess.stdout.on('data', function(data) {
            console.log(data);
        });
        childProcess.stderr.on('data', function(data) {
            console.log(data);
        });
    }
});
gulp.task('develop', ['less', 'supervisor']);