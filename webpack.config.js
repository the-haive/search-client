var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');
var browserify = require('browserify');
var path = require('path');
var fs = require('fs');

/* helper function to get into build directory */
var libPath = function(name) {
	if ( undefined === name ) {
		return 'dist';
	}

	return path.join('dist', name);
};

/* helper to clean leftovers */
var outputCleanup = function(dir, initial) {
	if (false === fs.existsSync(libPath())){
		return;
	}

	if ( true === initial ) {
		console.log("Build leftover found, cleans it up.");
	}

	var list = fs.readdirSync(dir);
	for(var i = 0; i < list.length; i++) {
		var filename = path.join(dir, list[i]);
		var stat = fs.statSync(filename);

		if(filename === "." || filename === "..") {
			// pass these files
			} else if(stat.isDirectory()) {
				// outputCleanup recursively
				outputCleanup(filename, false);
			} else {
				// rm fiilename
				fs.unlinkSync(filename);
			}
	}
	fs.rmdirSync(dir);
};

/* precentage handler is used to hook build start and ending */
var percentage_handler = function handler(percentage, msg) {
	if ( 0 === percentage ) {
		/* Build Started */
		outputCleanup(libPath(), true);
		console.log("Build started...");
	} else if ( 1 === percentage ) {
		create_browser_version(webpack_opts.output.filename);
	}
};

var webpack_opts = {
	entry: './src/SearchClient.ts',
	target: 'node',
	output: {
		filename: libPath('search-client.js'),
		libraryTarget: "commonjs2"
	},
	resolve: {
		extensions: ['.ts', 'tsx', '.js', '.jsx'],
		modules: [
			'node_modules',
			'src'
		]
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				enforce: 'pre',
				loader: 'tslint-loader',
				options:{
					emitErrors: false,
					failOnHint: false,
				}
			},
			{
				test: /\.tsx?$/,
				loaders: ['awesome-typescript-loader'],
			}
		]
	},
	externals: [nodeExternals()],
	plugins: [
		//new webpack.optimize.UglifyJsPlugin(),
		new webpack.ProgressPlugin(percentage_handler)
	]
};

var create_browser_version = function (inputJs) {
	let outputName = inputJs.replace(/\.[^/.]+$/, "");
	outputName = `${outputName}.browser.js`;
	console.log("Creating browser version ...");

	let b = browserify(inputJs, {
		standalone: 'search-client' //bundle_opts.name
	});

	b.bundle(function(err, src) {
		if ( err !== null ) {
			console.error("Browserify error:");
			console.error(err);
		} else {
			console.log("Browser version created.");
		}
	}).pipe(fs.createWriteStream(outputName));
};

module.exports = webpack_opts;
