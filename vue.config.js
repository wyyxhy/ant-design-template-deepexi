process.env.VUE_APP_USER = process.env.USER
process.env.VUE_APP_BUILD_DATETIME = new Date()

const config = {
  publicPath: './',
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: false,
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    proxy: { //配置代理API
        '/': {
            target: 'http://47.99.180.157:3001',
            changeOrigin: false,  //是否跨域
            ws: false,
        }
    }
},
}

module.exports = config
