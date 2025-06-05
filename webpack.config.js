const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'scripts', 'index.js'), // Изменили путь к точке входа
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'scripts/[name].[contenthash].js',
    publicPath: '/',
    assetModuleFilename: 'images/[name][ext]'
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'), // Изменили путь к шаблону
      filename: 'index.html',
      inject: 'body'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { 
          from: path.resolve(__dirname, 'images'), 
          to: 'images',
          noErrorOnMissing: true
        },
        {
          from: path.resolve(__dirname, 'vendor'),
          to: 'vendor',
          noErrorOnMissing: true // Добавили на случай отсутствия папки
        }
      ]
    })
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        type: 'asset/resource'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]'
        }
      }
    ]
  },

  resolve: {
    alias: {
      '@images': path.resolve(__dirname, 'images'),
      '@scripts': path.resolve(__dirname, 'scripts')
    }
  }
};
