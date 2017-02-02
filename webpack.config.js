var webpack = require('webpack');
var path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    "search-client": process.env.NODE_ENV === 'dev' ? './index.ts' : './search-client/index.ts'
  },
  devtool: 'source-map',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname),
    publicPath: '/assets'
  },
  devServer: {
    contentBase: path.resolve(__dirname, './src')
  },
  resolve: {
    alias: {
      tape: 'browser-tap'
    },
    extensions: ['.ts', 'tsx', '.js', '.jsx'],
    modules:[
      path.resolve('./src'),
      'node_modules'
    ]
  },
  module: {
    noParse: [
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

// if (process.env.NODE_ENV === 'dev') {
//   module.exports.entry.push('webpack-dev-server/client?http://0.0.0.0:8080');
//   module.exports.entry.push('webpack/hot/only-dev-server');
// }

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins.push(new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }))
}
