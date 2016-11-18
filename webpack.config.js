var path = require('path');
var webpack = require('webpack');
var postcss = require('postcss');
var postcssImport = require('postcss-import');
var postcssNested = require('postcss-nested');
var postcssCustomProps = require('postcss-custom-properties');
var autoprefixer = require('autoprefixer');
var postcssCalc = require('postcss-calc');
var postcssLost = require('lost');
var stylelint = require('stylelint');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackGitHash = require('webpack-git-hash');
var updateVersion = require('./updateVersion');

function _shouldMockAPI() {
  return !!process.env.MOCKAPI;
}

var entry = _shouldMockAPI() ? path.resolve('./mock-api/getApiResult') :
  {
    widget: [path.resolve('./app/widget')],
    app: [path.resolve('./app/index')],
  };

var jsLoaders = ['babel'];

/**
 * Setup plugins
 */
var gitHashOpts = {
  cleanup: true,
  callback: updateVersion
};
// If hash is passed from command line, e.g. $ npm run build abcd123
if (process.argv.length >= 5 && /^[a-z0-9]+$/.test(process.argv[4])) {
  gitHashOpts.skipHash = process.argv[4];
}

var plugins = process.env.DEVELOPMENT ?
  [new webpack.HotModuleReplacementPlugin()] :
  [new WebpackGitHash(gitHashOpts)];

var publicPath = '/static/';

if (process.env.DEVELOPMENT) {
  entry.app.unshift('react-hot-loader/patch');
  entry.app.unshift('webpack/hot/only-dev-server');
  entry.app.unshift('webpack-dev-server/client?http://localhost:8080');
  publicPath = 'http://localhost:8080' + publicPath;
}

var output = _shouldMockAPI() ?
  {
    path: path.join(__dirname, 'mock-api'),
    publicPath: '/mock-api/',
    filename: 'getApiResult.bundle.js',
  } :
  {
    path: path.join(__dirname, 'static'),
    publicPath: publicPath,
    filename: process.env.DEVELOPMENT || process.env.JEKYLL ? '[name].js' : '[name].[githash].js',
    chunkFilename: process.env.DEVELOPMENT || process.env.JEKYLL ? '[id].chunk.js' : '[id].[githash].chunk.js'
  };

module.exports = {
  devtool: 'source-map',
  entry: entry,
  output: output,
  plugins: plugins,
  postcss: function(webpack) {
    return [
      postcssImport({
        addDependencyTo: webpack,
      }),
      postcssNested,
      postcssCustomProps,
      autoprefixer,
      postcssCalc,
      postcssLost,
      stylelint(require('./stylelint.config.js')),
    ];
  },
  module: {
    preLoaders: [
      { test: /\.js$/, loader: 'eslint', exclude: /node_modules/ },
    ],
    loaders: [
      {
        test: /\.js$/,
        loaders: jsLoaders,
        include: path.join(__dirname, 'app'),
      },
      {
        test: /mock-api.*\.js$/,
        loaders: jsLoaders,
        include: path.join(__dirname, 'mock-api'),
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'style!css?modules&localIdentName=[name]__[local]___[hash:base64:5]!postcss',
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url?limit=25000',
      }
   ]
  }
};
