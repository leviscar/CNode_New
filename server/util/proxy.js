const axios = require('axios')
const baseUrl = 'https://cnodejs.org/api/v1'
const queryString = require('query-string')

module.exports = function (req, res, next) {
  const path = req.path
  const user = req.session.user || {}
  const needAccessToken = req.query.needAccessToken
  if (needAccessToken && !user.accessToken) {
    res.status(401).send({
      success: false,
      meg: 'need login'
    })
  }

  const query = Object.assign({}, req.query, {
    accesstoken: (needAccessToken && req.method === 'GET') ? user.accessToken : ''
  })
  if (query.needAccessToken) delete query.needAccessToken

  axios(`${baseUrl}${path}`, { method: req.method,
    params: query,
    data: queryString.stringify(Object.assign({}, req.body, {
      accesstoken: (needAccessToken && req.method === 'POST') ? user.accessToken : ''
    })),
    header: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  }).then(resp => {
    if (resp.status === 200) {
      res.send(resp.data)
    } else {
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
