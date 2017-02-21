/**
 * simple-step
 * https://github.com/Alex1990/simple-step
 *
 * Copyright (c) 2014 Alex Chao
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration
  grunt.initConfig({
    jshint: {
      all: [
        'src/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    uglify: {
      build: {
        options: {
          preserveComments: 'some'
        },
        files: [
          {
            expand: true,
            cwd: 'src',
            src: '**/*.js',
            dest: 'dist'
          }
        ]
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'uglify']);

};
