const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'scripts', 'index.js'),

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'scripts/[name].[contenthash].js',
    publicPath: '/',
    assetModuleFilename: 'images/[name][ext]',
    clean: true
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
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
          from: path.resolve(__dirname, 'vendor', 'fonts'),
          to: 'fonts',
          noErrorOnMissing: true
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash].css',
      chunkFilename: 'styles/[id].[contenthash].css'
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
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../' // Корректирует пути к изображениям в CSS
            }
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              url: {
                filter: (url) => {
                  // Не обрабатываем абсолютные пути и данные URI
                  if (url.startsWith('/') || url.startsWith('data:')) {
                    return false;
                  }
                  return true;
                }
              }
            }
          },
          'postcss-loader' // Добавлен PostCSS
        ],
        include: [
          path.resolve(__dirname, 'pages'), // Главный index.css
          path.resolve(__dirname, 'blocks'), // BEM-блоки
          path.resolve(__dirname, 'vendor') // normalize.css
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
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
      '@scripts': path.resolve(__dirname, 'scripts'),
      '@styles': path.resolve(__dirname, 'pages') // Для импорта index.css
    }
  },

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: process.env.PORT || 8080,
    hot: true,
    historyApiFallback: true,
    allowedHosts: 'all',
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },

  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};
