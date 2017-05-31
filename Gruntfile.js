module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: '\n'
      },
      build: {
        src: ['src/js/vendor/unmin/phaser.js', 'src/js/*.js', 'src/js/start/*.js'],
        dest: 'dist/app.js',
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/app.js': ['<%= concat.build.dest %>']
        }
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          // jQuery: true,
          module: true
        }
      }
    },
    clean: ['./dist/'],
    express: {
      dev: {
        options: {
          script: 'index.js'
        }
      }
    },
    watch: {
      express: {
        files:  [ 'src/js/start/game.js', 'src/js/*.js', 'assets/**/*.png', 'index.html' ],
        tasks:  ['clean', 'jshint', 'concat:build', 'express:dev'],
        options: {
          spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded 
        }
      }   
    }
  });

  grunt.event.on('watch', function(action, filepath, target) {
    console.log(target + ': ' + filepath + ' has ' + action);
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('test', ['jshint']);

  grunt.registerTask('local', ['jshint', 'concat:build', 'express:dev', 'watch']);

  grunt.registerTask('build', ['jshint', 'concat:build', 'uglify']);

};