module.exports = {
  plugins: [
    require('postcss-import')({
      path: ['blocks', 'pages'] // Где искать импортируемые CSS-файлы
    }),
    require('autoprefixer')({
      overrideBrowserslist: ['last 2 versions']
    }),
    require('cssnano')({
      preset: 'default'
    })
  ]
}
