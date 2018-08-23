const path = require('path')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const webpack = require('webpack')

module.exports = webpackMerge(baseConfig, {
  target: 'node', // js打包出来的内容是放在哪个执行环境里面的，web 浏览器 node node.js
  entry: {
    app: path.join(__dirname, '../client/server-entry.js')
  },
  externals: Object.keys(require('../package').dependencies),
  output: {
    filename: 'server-entry.js', // 不用加hash，服务端没有浏览器缓存的概念 需要import 所以要个简单的名字
    libraryTarget: 'commonjs2'// 打包出来的js的模块化方案 amd cmd
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_BASE': '"http://127.0.0.1:3333"'
    })
  ]
})
