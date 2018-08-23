const express = require('express')
const fs = require('fs')
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'
const favicon = require('serve-favicon')
// bodyParser 转换请求的body 转换为json
const bodyParser = require('body-parser')
// express-session 是基于express框专门用于处理session的中间件
// querystring从字面上的意思就是查询字符串，一般是对http请求所带的数据进行解析
const session = require('express-session')
const serverRender = require('./util/server-render')
// accessToken 放在nodeJs端的session里面
const app = express()

// application json 转换成 req.body上面的数据
app.use(bodyParser.json())
// www 请求 放在 req.body上面的数据
app.use(bodyParser.urlencoded({ extended: false }))

app.use(favicon(path.join(__dirname, '../favicon.ico')))

app.use(session({
  maxAge: 10 * 60 * 1000, // 10分钟后，session和相应的cookie失效过期
  name: 'tid', // cookie id,默认的name是：connect.sid
  resave: false, // 是否每次请求需要重新生成cookie id
  saveUninitialized: false,
  secret: 'leviscar' // 加密cookie，保证cookie在浏览器端无法被解密
}))

// 将代理的操作放在服务端渲染之前
// 服务端渲染的时候，所有请求过来它都会处理然后返回一个值
// 所以要先对这两个代理处理一下
// '/api/user'映射到 handle-login
// '/api'映射到 proxy
app.use('/api/user', require('./util/handle-login'))
app.use('/api', require('./util/proxy'))

// 服务端渲染优化
// 路由跳转优化
// store 数据同步
// 每个页面会有对应的数据，在服务端渲染时已经请求过对应数据，所以要让客户端知道这些数据
// 在客户端渲染的时候直接使用，而不是通过API再次请求，造成浪费

if (!isDev) {
  const serverEntry = require('../dist/server-entry')
  const template = fs.readFileSync(path.join(__dirname, '../dist/server.ejs'), 'utf8')// 读成一个string
  app.use('/public', express.static(path.join(__dirname, '../dist')))// 区分是否是静态文件
  app.get('*', function (req, res, next) {
    serverRender(serverEntry, template, req, res).catch(next)
  })
} else {
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
