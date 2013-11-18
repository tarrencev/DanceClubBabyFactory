module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['app/js/*.js'],
      options: {
          ignores: ['app/js/app.js']
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['app/js/*.js'],
        dest: 'app/js/app.js',
      },
    },
    express: {
      options: {
        // Override defaults here
        port: 8080
      },
      dev: {
        options: {
          script: 'server.js'
        }
      }
    },
    watch: {
      express: {
        files:  [ 'app/js/*.js' ],
        tasks:  [ 'jshint', 'express:dev' ],
        options: {
          nospawn: true //Without this option specified express won't be reloaded
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'concat' ,'express:dev', 'watch']);
};