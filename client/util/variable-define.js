// cnode api 返回 topic时包括的值
export const topicSchema = {
    id: '',
    author_id: '',
    tab: '',
    content: '',
    title: '',
    last_reply_at: '',
    good: false,
    top: false,
    reply_count: 0,
    visit_count: 0,
    create_at: '',
    is_collect: '',
    author: {
        loginname: '',
        avatar_url: '',
    },
    replies: [],
};
export const replySchema = {
    id: '',
    author: {
        loginname: '',
        avatar_url: '',
    },
    content: '',
    ups: [],
    create_at: '',
    reply_id: null,
    is_uped: false,
};
// export const tabs = {
//   all: 'All',
//   share: 'Share',
//   job: 'Job',
//   ask: 'Q&A',
//   good: 'Good',
//   dev: 'Test',
// };

export const tabs = {
    all: '全部',
    share: '分享',
    job: '招聘',
    ask: '问答',
    good: '精华',
    dev: '测试',
};
export default {
    replySchema,
    tabs,
};
