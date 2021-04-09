const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const outputDirectory = 'dist';

module.exports = (env) => {
  console.log(env);
  const isProduction = env.production;

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
      extensions: ['*', '.js', '.jsx']
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
      })
    ],
    experiments: {
      topLevelAwait: true
    }
  };
};
