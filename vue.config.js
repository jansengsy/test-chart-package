// vue.config.js
module.exports = {
    productionSourceMap: false,
    css: {
      extract: false,
    },
    configureWebpack: {
      entry: {
        main: './src/index.js', // Entry file for your components
      },
      output: {
        filename: 'arc-charts.js',
        library: 'ArcChartComponents',
        libraryTarget: 'umd',
      },
    },
  };