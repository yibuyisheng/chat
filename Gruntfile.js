module.exports = function(grunt) {

    var cfg = grunt.file.readJSON('package.json');
    grunt.initConfig({
        pkg: cfg,
        supervisor: {
            target: {
                script: cfg.main,
                options: {
                    harmony: true,
                    debug: true,
                    watch: ['server.js', 'templates', 'plugins'],
                    extensions: ['js,jade']
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-supervisor");

    grunt.registerTask('develop', ['supervisor']);

};