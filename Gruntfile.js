module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: '\n'
      },
      local: {
        src: ['src/js/vendor/unmin/phaser.js', 'src/js/*.js', 'src/js/start/*.js'],
        dest: 'dist/app.js',
      },
      build: {
        src: ['src/js/vendor/min/phaser.min.js', 'src/js/*.js', 'src/js/start/*.js'],
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

  grunt.registerTask('test', ['jshint']);

  grunt.registerTask('local', ['jshint', 'concat:local']);

  grunt.registerTask('build', ['jshint', 'concat:build', 'uglify']);

};