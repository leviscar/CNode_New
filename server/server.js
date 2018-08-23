const express = require('express')
// const fs = require('fs')
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'
const favicon = require('serve-favicon')
// bodyParser 转换请求的body 转换为json
const bodyParser = require('body-parser')
// express-session 是基于express框专门用于处理session的中间件
// querystring从字面上的意思就是查询字符串，一般是对http请求所带的数据进行解析
const session = require('express-session')

const app = express()

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }))

app.use(favicon(path.join(__dirname, '../favicon.ico')))

app.use(session({
    maxAge: 10 * 60 * 1000, // 10分钟后，session和相应的cookie失效过期
    name: 'tid', // cookie id,默认的name是：connect.sid
    resave: false, // 是否每次请求需要重新生成cookie id
    saveUninitialized: false,
    secret: 'leviscar' // 加密cookie，保证cookie在浏览器端无法被解密
}))

if (isDev) {
    const devStatic = require('./util/dev-static')
    devStatic(app)
}
app.use(function (error, req, res, next) {
    console.log(error)
    res.status(500).send(error)
})

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3333

app.listen(port, host, function () {
    console.log('Server is running on port 3333')
})
