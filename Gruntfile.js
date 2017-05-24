module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      local: {
        src: ['src/js/vendor/unmin/phaser.js', 'src/js/*.js'],
        dest: 'dist/unminifiedgame.js',
      },
      build: {
        src: ['src/js/vendor/min/phaser.min.js', 'src/js/*.js'],
        dest: 'dist/minifiedgame.js',
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/minifiedgame.js': ['<%= concat.build.dest %>']
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

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('test', ['jshint']);

  grunt.registerTask('local', ['jshint', 'concat:local']);

  grunt.registerTask('build', ['jshint', 'concat:build', 'uglify']);

};