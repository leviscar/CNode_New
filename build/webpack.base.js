const path = require('path')

module.exports = {
    output: {
        path: path.join(__dirname, '../dist'), // 打包出来的文件的存放位置
        publicPath: '/public/'// 区分url是静态资源还是其他需要特殊处理的请求，使用CDN的时候替换成CDN的域名就可以直接使用
    },
    // 配置使其可以不用使用 .js 以及 .jsx的后缀名
    resolve: {
        extensions: ['.js', '.jsx']
    },
    // 配置让webpack识别jsx语法，默认不能识别jsx语法
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /.(js|jsx)$/, // 哪种类型的文件是jsx语法，需要用loader去识别它
                loader: 'eslint-loader',
                exclude: [
                    path.join(__dirname, '../node_modules')// 排除node_modules下面的代码
                ]
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'// 哪种类型的文件是jsx语法，需要用loader去识别它，将jsx,es6,es7编译
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: [
                    path.join(__dirname, '../node_modules')
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    }
}
