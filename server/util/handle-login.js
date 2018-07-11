// 登录接口处理文件
const router = require('express').Router()
const axios = require('axios')

const baseUrl = 'https://cnodejs.org/api/v1'

router.post('/login', function (req, res, next) {
  // 验证 accessToken的正确性
  // 往服务器发送请求
  axios.post(`${baseUrl}/accesstoken`, {
    accesstoken: req.body.accessToken
  })
    .then((resp) => {
      if (resp.status === 200 && resp.data.success) {
        // 保存在 req.session里面，下次请求的时候可以读到这个
        req.session.user = {
          accessToken: req.body.accessToken,
          loginname: resp.data.loginname,
          id: resp.data.id,
          avatar_url: resp.data.avatar_url
        }

        // 验证 accessToke正确了以后，给浏览器端发送数据
        res.json({
          success: true,
          data: resp.data
        })
      }
    }).catch(err => {
      if (err.response) {
        // 如果往服务器请求的时候有返回值，但是是业务逻辑的错误，那我们把response返回给浏览器端
        res.json({
          success: false,
          // 坑之一，因为err.response是个嵌套很深层的对象,所以在json这个方法里面没法被stringify,
          // 使用res.json 的时候是默认会把这一部分的内容用json.stringify 转化为字符串
          // response对象嵌套层级太多，无法转化为一个字符串
          // 会报错，不能用err.response 来返回值，需要用err.response.data
          data: err.response.data
        })
      } else {
        // 把错误抛给全局的错误处理器
        next(err)
      }
    })
})

module.exports = router
