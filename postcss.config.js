module.exports = {
  plugins: [
    require('postcss-preset-env')({
      features: {
        'nesting-rules': true
      }
    }),
    require('autoprefixer'),
    require('cssnano')({
      preset: 'default'
    })
  ]
}
