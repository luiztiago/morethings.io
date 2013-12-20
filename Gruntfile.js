'use strict';
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '_source/assets/js/*.js',
        '_source/assets/js/plugins/*.js',
        '!_source/assets/js/scripts.min.js'
      ]
    },
    recess: {
      dist: {
        options: {
          compile: true,
          compress: true
        },
        files: {
          '_site/assets/css/main.min.css': [
            '_source/assets/less/main.less'
          ]
        }
      }
    },
    uglify: {
      dist: {
        files: {
          '_site/assets/js/scripts.min.js': [
            '_source/assets/js/plugins/*.js',
            '_source/assets/js/_*.js'
          ]
        }
      }
    },
    imagemin: {
      dist: {
        options: {
          optimizationLevel: 7,
          progressive: true
        },
        files: [{
          expand: true,
          cwd: '_source/images/',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '_site/images/'
        }]
      }
    },
    jekyll: {
      options: {
        auto: true
      },
      serve: {
        options: {
          serve: true,
          port: 4000
        }
      },
      build: {
        options: {
          serve: false
        }
      }
    },
    watch: {
      less: {
        files: [
          '_source/assets/less/*.less'
        ],
        tasks: ['recess']
      },
      js: {
        files: [
          '<%= jshint.all %>'
        ],
        tasks: ['uglify']
      },
      jekyll: {
        files: ['_source/_posts/*.markdown', '_source/_layouts/*.html', '_source/_includes/*.html', '_source/index.html', '_config.yml'],
        tasks: ['jekyll:serve']
      }
    },
    clean: {
      dist: [
        '_site/assets/css/main.min.css',
        '_site/assets/js/scripts.min.js'
      ]
    }
  });

  // Load tasks
  grunt.loadNpmTasks('grunt-jekyll');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-contrib-imagemin');

  // Register tasks
  grunt.registerTask('default', ['clean','recess','uglify','imagemin','jekyll:serve']);
  grunt.registerTask('build', ['clean','recess','uglify','imagemin','jekyll:build']);

};
