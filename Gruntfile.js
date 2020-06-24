module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
		includes: {
		  files: {
		    src: ['src/html/*.html'], // Source files
		    dest: 'docs/', // Destination directory
		    flatten: true,
		    cwd: '.',
		    options: {
		      silent: true,
		      // banner: '<!-- I am a banner <% includes.files.dest %> -->'
		    }
		  }
    },
    clean: {
      all:['docs/**'],
      css:['docs/css/*.css'],
      js:['docs/js/*.js'],
      html:['docs/*.html']
    },
		watch: {
			includes: {
				files: 'src/html/**',
				tasks: ['clean:html','includes']
      },
      css: {
				files: 'src/css/*.css',
				tasks: ['clean:css','copy:css']
			},
      js: {
				files: 'src/js/*.js',
				tasks: ['clean:js','copy:js']
			},
    },
    copy: {
      all: {
        files: [
          // includes files within path and its sub-directories
          {expand: true, cwd: 'src/', src: ['css/**','fonts/**','js/**'], dest: 'docs/'},
        ],
      },
      css: {
        files: [
          // includes files within path and its sub-directories
          {expand: true, cwd: 'src/', src: ['css/**'], dest: 'docs/'},
        ],
      },
      js: {
        files: [
          // includes files within path and its sub-directories
          {expand: true, cwd: 'src/', src: ['js/**'], dest: 'docs/'},
        ],
      },
    },
    browserSync: {
      bsFiles: {
          src : 'docs/'
      },
      options: {
          server: {
              baseDir: "docs/"
          }
      }
    }  
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-includes');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-browser-sync');


	// grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.registerTask('default',['dist','watch']);
  grunt.registerTask('dist',['clean:all','copy:all','includes'])
};