'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: [
      '/*! <%= pkg.title || pkg.name %>',
      ' * <%= pkg.description %>',
      ' * ',
      ' * Version: <%= pkg.version %>',
      ' * Home: <%= pkg.homepage %>',
      ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>',
      ' * ',
      ' * Licensed under the <%= pkg.license %> license.',
      ' */\n'
    ].join('\n'),
    // Task configuration.
    clean: {
      files: ['dist']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['src/jqueryui.<%= pkg.name %>.js'],
        dest: 'dist/jqueryui.<%= pkg.name %>.js'
      },
    },
    connect: {
      server: {
        options: {
          port: 8088
        }
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/jqueryui.<%= pkg.name %>.min.js'
      },
    },
    qunit: {
      all: {
        options: {
          urls: [
            'http://localhost:<%= connect.server.options.port %>/test/form-dialog.html'
          ]
        }
      }
    },
/*    qunit: {
      // @see http://markdalgleish.com/2013/01/testing-jquery-plugins-cross-version-with-grunt/
      // for running tests with different jquery/jquery-ui versions
      files: ['test/*.html']
    },//*/
    jshint: {
      options: {
        jshintrc: true
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['src/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      },
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'qunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      },
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task.
  grunt.registerTask('default', ['connect', 'jshint', 'qunit', 'clean', 'concat', 'uglify']);
  grunt.registerTask('test',    ['connect', 'jshint', 'qunit']);
};
