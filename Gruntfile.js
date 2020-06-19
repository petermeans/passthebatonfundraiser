module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
		includes: {
		  files: {
		    src: ['src/html/*.html'], // Source files
		    dest: 'dist/', // Destination directory
		    flatten: true,
		    cwd: '.',
		    options: {
		      silent: true,
		      // banner: '<!-- I am a banner <% includes.files.dest %> -->'
		    }
		  }
    },
    clean: {
      all:['dist/'],
      css:['dist/css/*.css'],
      js:['dist/js/*.js'],
      html:['dist/*.html']
    },
		watch: {
			includes: {
				files: 'src/html/*.html',
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
          {expand: true, cwd: 'src/', src: ['css/**','fonts/**','js/**'], dest: 'dist/'},
        ],
      },
      css: {
        files: [
          // includes files within path and its sub-directories
          {expand: true, cwd: 'src/', src: ['css/**'], dest: 'dist/'},
        ],
      },
      js: {
        files: [
          // includes files within path and its sub-directories
          {expand: true, cwd: 'src/', src: ['js/**'], dest: 'dist/'},
        ],
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-includes');
  grunt.loadNpmTasks('grunt-contrib-copy');

	// grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.registerTask('default',['dist','watch']);
  grunt.registerTask('dist',['clean:all','copy:all','includes'])
};