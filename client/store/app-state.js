import { observable, action, toJS } from 'mobx';
import { post, get } from '../util/http';

// 不需要在这里创建实例，另外有地方创建
export default class AppState {
  @observable user={
      isLogin: false,
      info: {},
      detail: {
          recentTopics: [],
          recentReplies: [],
          syncing: false,
      },
      collections: {
          syncing: false,
          list: [],
      },
  };
  init({ user }) {
      if (user) {
          this.user = user;
      }
  }
  @action login(accessToken) {
      return new Promise((resolve, reject) => {
          post('/user/login', {}, {
              accessToken,
          }).then((resp) => {
              if (resp.success) {
                  this.user.info = resp.data;
                  this.user.isLogin = true;
                  resolve();
              } else {
                  reject(resp);
              }
          }).catch(reject);
      });
  }
  @action getUserDetail() {
      this.user.detail.syncing = true;
      return new Promise((resolve, reject) => {
          get(`/user/${this.user.info.loginname}`)
              .then((resp) => {
                  if (resp.success) {
                      this.user.detail.recentReplies = resp.data.recent_replies;
                      this.user.detail.recentTopics = resp.data.recent_topics;
                      resolve();
                  } else {
                      reject();
                  }
                  this.user.detail.syncing = false;
              }).catch((err) => {
                  this.user.detail.syncing = false;
                  reject(err);
              });
      });
  }
  @action getUserCollections() {
      this.user.collections.syncing = true;
      return new Promise((resolve, reject) => {
          get(`/topic_collect/${this.user.info.loginname}`)
              .then((resp) => {
                  if (resp.success) {
                      this.user.collections.list = resp.data;
                      resolve();
                  } else {
                      reject();
                  }
                  this.user.collections.syncing = false;
              }).catch((err) => {
                  this.user.collections.syncing = false;
                  reject(err);
              });
      });
  }
  // 用于解决服务端数据和客户端 store不同步的方法
  // 服务端渲染得到的数据以json的格式传出
  // 想办法把这部分数据放在客户端能拿到的地方
  toJson() {
      return {
          user: toJS(this.user),
      };
  }
}
