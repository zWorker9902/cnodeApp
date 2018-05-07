
var setting = {
    newspage: 1,
    limit: 50,
    mdrender: true,
    pagecounts: 1,
}

var user = {
    login: false,
    accesstoken: 'bfa787f1-09cc-42d6-90e4-d4c0616d24b4'
}

var API_HOST = 'https://cnodejs.org/api/v1';
var cnodeAPI = {
    topics: API_HOST +  '/topics', //主题首页
    article: API_HOST+  '/topic/', // + 文章ID -- 文章详情
    user: API_HOST +  '/user/', // + 用户名称 -- 用户详情
    collect:  API_HOST +  '/topic_collect/collect', // 收藏主题
    uncollect:  API_HOST +  '/topic_collect/de_collect', // 取消收藏主题
    usercollect: API_HOST +  '/topic_collect/', // 用户收藏
    replies: API_HOST +  '/topic/topic_id/replies', // 用户评论
    replyups: API_HOST +  '/reply/reply_id/ups', // 为评论点赞



}