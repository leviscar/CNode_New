import AppState from './app-state';
import TopicStore from './topic-store';

export { AppState, TopicStore };

export default {
  AppState,
  TopicStore,
};

// 专门用来给服务端渲染使用
// 生成store
export const createStoreMap = () => {
  return {
    appState: new AppState(),
    topicStore: new TopicStore(),
  };
};
