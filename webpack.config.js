const path = require('path');
const webpack = require('webpack');
const entry = require('./entry');

module.exports = {
  devServer: {
    stats: 'errors-only',
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
      },
    },
    host: 'localhost',
  },
  entry,
  output: {
    publicPath: '/',
    path: path.join(__dirname, 'public'),
    filename: '[name].bundle.js',
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src', 'utils'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        include: path.join(__dirname, 'src'),
        use: 'babel-loader?cacheDirectory',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      },
    }),
    new webpack.HotModuleReplacementPlugin({ mutiStep: true }),
  ],
};

