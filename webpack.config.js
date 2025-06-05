const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    main: './scripts/index.js',
    styles: './pages/index.css'
  },
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash].js',
    publicPath: '/',
    clean: true,
    assetModuleFilename: 'assets/[hash][ext][query]'
  },

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
              publicPath: '../'
            }
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              url: {
                filter: (url) => {
                  if (url.startsWith('/') || url.startsWith('data:')) {
                    return false;
                  }
                  return true;
                }
              }
            }
          },
          'postcss-loader'
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

  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[id].[contenthash].css'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'images',
          to: 'images/[name][ext]',
          noErrorOnMissing: true,
          globOptions: {
            ignore: ['**/.DS_Store']
          }
        },
        {
          from: 'vendor',
          to: 'vendor/[name][ext]',
          noErrorOnMissing: true
        },
        {
          from: 'blocks/**/*.css',
          to: 'blocks/[name][ext]',
          noErrorOnMissing: true
        }
      ]
    })
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: process.env.PORT || 8080,
    hot: true,
    historyApiFallback: {
      index: '/',
      disableDotRule: true
    },
    allowedHosts: 'all',
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
      logging: 'error'
    },
    devMiddleware: {
      writeToDisk: true
    }
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    },
    runtimeChunk: 'single'
  },

  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};
