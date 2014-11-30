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
                    extensions: ['js,jade'],
                    forceSync: true
                }
            }
        },
        less: {
            development: {
                options: {
                    paths: ["static/less"]
                },
                files: {
                    "static/css/main.css": "static/less/main.less"
                }
            }//,
            // production: {
            //     options: {
            //         paths: ["assets/css"],
            //         cleancss: true,
            //         modifyVars: {
            //             imgPath: '"http://mycdn.com/path/to/images"',
            //             bgColor: 'red'
            //         }
            //     },
            //     files: {
            //         "path/to/result.css": "path/to/source.less"
            //     }
            // }
        },
        watch: {
            less: {
                files: ['static/less/*.less'],
                tasks: ['less:development'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-supervisor");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.registerTask('develop', ['supervisor', 'watch:less']);

};