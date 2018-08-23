const path = require('path')// 完成绝对路径的书写，使用相对路径可能会存在系统之间的差异
const HTMLWebpackPlugin = require('html-webpack-plugin')// 生成一个HTML页面，编译js完成以后都注入到这个html里面
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const isDev = process.env.NODE_ENV === 'development'

const config = webpackMerge(baseConfig, {
    entry: {
        app: path.join(__dirname, '../client/app.js')// 依赖树的入口，依赖的js一旦改变，hash值会改变
    },
    output: {
        filename: '[name].[hash].js'// name entry里面的appname hash打包完成以后根据内容来加一个hash值
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.join(__dirname, '../client/template.html'), // 生成的html以该文件作为模板
            favicon: path.join(__dirname, '../favicon.ico')
        })
    // new HTMLWebpackPlugin({
    //   template: '!!ejs-compiled-loader!' + path.join(__dirname, '../client/server.template.ejs'),
    //   filename: 'server.ejs'
    // })
    ]
})

if (isDev) {
    config.entry = {
        app: [
            'react-hot-loader/patch',
            path.join(__dirname, '../client/app.js')
        ]
    }
    config.devServer = {
        host: '127.0.0.1',
        port: '8888',
        //  用于告诉服务器文件的根目录。这主要用来需要引用静态文件的时候。devServer.publicPath被用来规定变异文件的路径地址
        contentBase: path.join(__dirname, '../dist'),
        hot: true,
        open: true,
        overlay: { // 用于在浏览器输出编译错误的，默认是关闭的，需要手动打开
            errors: true
        },
        publicPath: '/public/',
        historyApiFallback: { // 这个配置属性是用来应对返回404页面时定向到特定页面用的
            index: '/public/index.html'
        }
        // proxy: {
        //     '/api': 'http://localhost:3333'
        // }
    }
    config.plugins.push(new webpack.SourceMapDevToolPlugin(), new webpack.HotModuleReplacementPlugin())
}

module.exports = config
