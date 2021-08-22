const path = require('path');
const webpack = require('webpack');
const moment = require('moment');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const SentryWebpackPlugin = require("@sentry/webpack-plugin");

const outputDirectory = 'dist';

module.exports = (env) => {
  console.log(env);
  const isProduction = !!env.production;

  if (isProduction) {
    console.log('Using PRODUCTION config');
  } else {
    console.log('Using DEVELOPMENT config');
  }

  return {
    entry: ['babel-polyfill', './src/client/js/index.js'],
    output: {
      path: path.join(__dirname, outputDirectory),
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.(scss|css)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader'
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              }
            }
          ]
        },
        {
          test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/,
          use: [
            'file-loader'
          ]
        }
      ]
    },
    resolve: {
      extensions: ['*', '.js', '.jsx'],
      /*fallback: {
        "fs": false,
        "tls": false,
        "net": false,
        "path": false,
        "zlib": false,
        "http": false,
        "https": false,
        "stream": false,
        "crypto": false,
        "util": false,
        "os": false
      }*/
    },
    devServer: {
      port: 3000,
      open: true,
      historyApiFallback: true,
      proxy: {
        '/api': 'http://localhost:8080'
      }
    },
    devtool : isProduction ? 'source-map' : 'inline-source-map',
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        template: './src/client/index.html',
        hash: true
      }),
      new webpack.EnvironmentPlugin({
        IS_PRODUCTION: !!isProduction,
        IS_MAIN_NETWORK: false,
        SENTRY_JS_DSN: false
      }),
      new NodePolyfillPlugin(),
      new SentryWebpackPlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: "polkaswitch",
        project: "frontend",
        release: process.env.HEROKU_RELEASE_VERSION,

        // webpack-specific configuration
        include: ".",
        ignore: ["node_modules", "webpack.config.js"]
      }),
    ],
    experiments: {
      topLevelAwait: true
    }
  };
};
