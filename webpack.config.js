var webpack = require('webpack');
var path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader')

//let targetFolder = process.env.NODE_ENV === 'dev' ? 'public' : 'public'; // TODO: Change to use lib on production (problem is that the tsconfig.json probably also must have this somehow)

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    "search-client": './index.js',
  },
  devtool: 'source-map',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './lib'),
    publicPath: '/assets'                          // New
  },
  devServer: {
    contentBase: path.resolve(__dirname, './src'),  // New
  },
  resolve: {
    alias: {
      tape: 'browser-tap',
//      sinon: 'sinon/pkg/sinon', // https://github.com/webpack/webpack/issues/177#issuecomment-185718237
    },
    extensions: ['.ts', 'tsx', '.js', '.jsx'],
    modules:[
      path.resolve('./src'),
      'node_modules'
    ]
  },
  module: {
    noParse: [
//      /sinon/,
      /browser-tap/
    ],
    rules: [
      { 
        test: /\.tsx?$/, 
        use: "awesome-typescript-loader",
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { 
        enforce: 'pre',
        test: /\.js$/, 
        use: "source-map-loader",
        exclude: /(node_modules)/
      }
    ]
  },
  // these are all enzyme specific
  externals: {
    'cheerio': 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'dev')
      }
    }),
    new CheckerPlugin()
  ]
};

if (process.env.NODE_ENV === 'dev') {
  module.exports.entry.push('webpack-dev-server/client?http://0.0.0.0:8080');
  module.exports.entry.push('webpack/hot/only-dev-server');
}

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins.push(new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }))
}
