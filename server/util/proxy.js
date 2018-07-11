// 除了登录接口之外，其他的接口的代理处理文件
const axios = require('axios')
const baseUrl = 'https://cnodejs.org/api/v1'
// querystring从字面上的意思就是查询字符串，一般是对http请求所带的数据进行解析
const queryString = require('query-string')

module.exports = function (req, res, next) {
  // 拿到接口地址
  const path = req.path
  // 判断用户有没有登录
  const user = req.session.user || {}
  // 判断用户需不要要提供accessToken
  const needAccessToken = req.query.needAccessToken
  if (needAccessToken && !user.accessToken) {
    // 告诉客户端，401--未登录 ，发送信息
    res.status(401).send({
      success: false,
      meg: 'need login'
    })
  }

  // 把query重新定义一下
  const query = Object.assign({}, req.query, {
    // 如果get请求需要 accessToken需要做如下处理
    accesstoken: (needAccessToken && req.method === 'GET') ? user.accessToken : ''
  })
  if (query.needAccessToken) delete query.needAccessToken

  // 如果是已经登录的，那就开始代理的代码
  // 不能把浏览器端的query直接传到服务端，因为那个query上有我们自己加的一些属性
  axios(`${baseUrl}${path}`, { method: req.method,
    params: query,
    // 没有用 stringfy 传输字符串为 {'accesstoken':'xxx'}
    // 转化了之后 变为 'accesstoken=xxx'
    data: queryString.stringify(Object.assign({}, req.body, {
      accesstoken: (needAccessToken && req.method === 'POST') ? user.accessToken : ''
    })),
    // cnode api 有些可以接受json，有些不可以，防止出现问题，我们全部设为下面的这种格式
    header: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  }).then(resp => {
    if (resp.status === 200) {
      // 代理成功的话，直接返回给浏览器端
      res.send(resp.data)
    } else {
      // 不是成功代码的话也原封不动地返回给浏览器端
      res.status(resp.status).send(resp.data)
    }
  }).catch(error => {
    if (error.response) {
      res.status(500).send(error.response.data)
    } else {
      res.status(500).send({
        success: false,
        msg: 'unknown error'
      })
    }
  })
}
