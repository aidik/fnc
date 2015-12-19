module.exports = function(grunt) {

	grunt.initConfig({

		// Concat
		concat: {
			js: {
				src: ["node_modules/jquery/dist/jquery.min.js", "node_modules/form-serializer/dist/jquery.serialize-object.min.js", "src/js/configurator.js"],
				dest: "app/js/configurator.js"
			},
			css: {
				src: ["src/css/style.css"],
				dest: "app/css/style.css"
			}
		},

		// Lint
		jshint: {
			files: ["src/js/configurator.js"],
			options: {
				jshintrc: ".jshintrc"
			}
		},

		// Uglify
		uglify: {
			target: {
				src: ["app/js/configurator.js"],
				dest: "app/js/configurator.min.js"
			},
			options: {
				preserveComments: "all"
			}
		},

		// CSSmin
		cssmin: {
	  		options: {
	    		shorthandCompacting: false,
	    		roundingPrecision: -1,
	  		},
	  		target: {
	    		files: {
	    			'app/css/style.min.css': ['app/css/style.css']
	    		}
	  		}
		},

		// watch for changes
		watch: {
		    files: ['src/js/*', 'src/css/*'],
		    tasks: ['default']
		}

	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");

	grunt.registerTask("build", ["concat", "uglify", "cssmin"]);
	grunt.registerTask("default", ["jshint", "build"]);
};
