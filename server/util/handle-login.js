const router = require('express').Router()
const axios = require('axios')

const baseUrl = 'https://cnodejs.org/api/v1'

router.post('/login', function (req, res, next) {
  axios.post(`${baseUrl}/accesstoken`, {
    accesstoken: req.body.accessToken
  })
    .then((resp) => {
      if (resp.status === 200 && resp.data.success) {
        req.session.user = {
          accessToken: req.body.accessToken,
          loginname: resp.data.loginname,
          id: resp.data.id,
          avatar_url: resp.data.avatar_url
        }
        res.json({
          success: true,
          data: resp.data
        })
      }
    }).catch(err => {
      if (err.response) {
        res.json({
          success: false,
          // 坑之一，因为err.response是个嵌套很深层的对象所以在json这个方法里面没法被stringify
          data: err.response.data
        })
      } else {
        next(err)
      }
    })
})

module.exports = router
