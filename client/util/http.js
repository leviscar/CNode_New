const axios = require('axios');

const baseUrl = process.env.API_BASE || '';

// 处理URL的函数
const parseUrl = (url, params) => {
  const paramsCopy = params || {};
  const str = Object.keys(paramsCopy).reduce((result, key) => {
    result += `${key}=${paramsCopy[key]}&`; //eslint-disable-line
    return result;
  }, '');
  // 去掉最后一个&
  return `${baseUrl}/api${url}?${str.substr(0, str.length - 1)}`;
};

export const get = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.get(parseUrl(url, params))
      .then((resp) => {
        const { data } = resp;
        if (data && data.success) {
          resolve(data);
        } else {
          reject(data);
        }
      }).catch(reject);
  });
};

export const post = (url, params, payload) => {
  return new Promise((resolve, reject) => {
    axios.post(parseUrl(url, params), payload)
      .then((resp) => {
        const { data } = resp;
        if (data && data.success) {
          resolve(data);
        } else {
          reject(data);
        }
      }).catch(reject);
  });
};

