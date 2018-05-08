angular.module('appMain.services', [])
// 全局服务配置
    .factory('GlobalService', function(){
        // URL地址
        var globalService = {
            // 48小时阅读排行
            get48HoursTopViewPosts: function(itemCounts){
                // return "http://wcf.open.cnblogs.com/blog/48HoursTopViewPosts/" + itemCounts;
                return "data/48topView.xml";
            },
            // 推荐播客列表
            getBloggersRecommend: function(pageIndex, pageSize){
                return "http://wcf.open.cnblogs.com/blog/bloggers/recommend/" + pageIndex + "/" + pageSize;
            },
            // 获取首页文章列表
            getSitehomeRecent: function(itemCounts){
                return "http://wcf.open.cnblogs.com/blog/sitehome/recent/" + itemCounts;
            },
            // 获取文章内容
            getBlogPostBody: function(postID){
                // return "http://wcf.open.cnblogs.com/blog/post/body/" + postID;
                return "data/newDetails.xml";
            },
            // 获取文章评论
            getBlogPostComments: function(postID, pageIndex, pageSize){
                // return " http://wcf.open.cnblogs.com/blog/post/"+ postID +"/comments/" + pageIndex + "/" + pageSize;
                return "data/newComments.xml";
            },
        };
        return globalService;
    })
    .factory('HttpService', ['GlobalService', '$http', '$q',
        function(GlobalService, $http, $q){
            return {
                // 获取48小时
                get48HoursTopViewPosts: function(itemCounts){
                    var defer = $q.defer();
                    var Url = GlobalService.get48HoursTopViewPosts(itemCounts);
                    $http.get(Url,{})
                        .then(function successCallback(response) {
                            defer.resolve(response.data);
                        }, function errorCallback(){
                            defer.reject("error");
                        });
                    return defer.promise;
                },
                // 获取文章信息
                getBlogPostBody: function(postID){
                    var defer = $q.defer();
                    var Url = GlobalService.getBlogPostBody(postID);
                    $http.get(Url,{})
                        .then(function successCallback(response) {
                            defer.resolve(response.data);
                        }, function errorCallback(){
                            defer.reject("error");
                        });
                    return defer.promise;
                },
                // 获取文章评论
                getBlogPostComments: function(postID){
                    var defer = $q.defer();
                    var Url = GlobalService.getBlogPostComments(postID, postID, postID);
                    $http.get(Url,{})
                        .then(function successCallback(response) {
                            defer.resolve(response.data);
                        }, function errorCallback(){
                            defer.reject("error");
                        });
                    return defer.promise;
                }
            };
        }])
    .factory("LocalSer", [function(){
        return {
            setLocal: function(params) {
                params.data && (params.data = JSON.stringify(params.data));
                window.localStorage[params.key] = params.data;
            },
            getLocal: function(key) {
                var params = window.localStorage[key];
                return params ? JSON.parse(params) : null;
            }
        }
    }])
    .factory("rootStr", ["$http", "$q", function($http, $q) {
        return {
            param:{
                page: 1,
                tab: "",
                limit: 5,
                mdrender: true,
            },
            author:{
                accesstoken: 'bfa787f1-09cc-42d6-90e4-d4c0616d24b4', /* 用户token */
                login: false, /* 用户是否登录 */
            },
            netstate: null,  /* 网络状态 */
            tabs: [
                "最新", "精华", "分享", "问答", "招聘",
            ],
            lunar: 'http://www.sojson.com/open/api/lunar/json.shtml', // 农历查询
            topics: 'https://cnodejs.org/api/v1/topics', // 话题
            details: 'https://cnodejs.org/api/v1/topic/',// + 文章ID -- 文章详情
            user: 'https://cnodejs.org/api/v1/user/',//  + 用户名称 -- 用户详情
            collect: 'https://cnodejs.org/api/v1/topic_collect/collect',// 收藏主题
            uncollect: 'https://cnodejs.org/api/v1/topic_collect/de_collect',// 取消收藏主题
            usercollect: 'https://cnodejs.org/api/v1/topic_collect/',// 用户收藏
            replies: 'https://cnodejs.org/api/v1/topic/:topic_id/replies', // 用户评论
            replyups: 'https://cnodejs.org/api/v1/reply/:reply_id/ups',// 为评论点赞
            checktoken: 'https://cnodejs.org/api/v1/accesstoken',// token验证
            messagecount: 'https://cnodejs.org/api/v1/message/count',// 获取未读消息数
            message: 'https://cnodejs.org/api/v1/messages',// 获取已读和未读消息
            markall: 'https://cnodejs.org/api/v1/message/mark_all',// 标记全部已读
            markone: 'https://cnodejs.org/api/v1/message/mark_one/:msg_id',// 标记单个消息为已读
        };
    }])
    .factory("topicsSer", ["rootStr", "$http", "$q", function(rootStr, $http, $q) {
        return {
            /* 获取话题信息 */
            getTopics: function(page, tab) {
                var defered = $q.defer();
                return $http.get(rootStr.topics,
                    {
                        params: {
                            page: page,
                            tab: tab,
                            limit: rootStr.param.limit,
                            mdrender: rootStr.param.mdrender
                        }
                    })
                    .success(function(response) {
                        defered.resolve(response.data);
                    }).error(function(response) {
                        defered.reject(!1);
                    });
                defered.promise;
            },
            /* 获取话题详情 */
            getTopic: function(id) {
                var params = {
                    mdrender: rootStr.param.mdrender,
                };
                if(rootStr.author.accesstoken){
                    params.accesstoken = rootStr.author.accesstoken;
                }
                var defered = $q.defer();
                return $http.get(
                    rootStr.details + id,
                    {
                        params: params
                    }
                ).success(function(response) {
                    defered.resolve(response);
                }).error(function(response) {
                    defered.reject(!1);
                });
                defered.promise;
            },

            /* 发布话题 */
            pushTopic: function(title, tab, content) {
                var defered = $q.defer();
                return $http.post(rootStr.topics,
                    {
                        accesstoken: rootStr.author.accesstoken,
                        title: title,
                        tab: tab,
                        content: content
                    })
                    .success(function(response) {
                        defered.resolve(response);
                    }).error(function(response) {
                        defered.reject(!1);
                    });
                defered.promise;
            },

            /* 更新话题 */
            updateTopic: function(topic_id, title, tab, content) {
                var defered = $q.defer();
                return $http.post(rootStr.topics,
                    {
                        accesstoken: rootStr.author.accesstoken,
                        topic_id: topic_id,
                        title: title,
                        tab: tab,
                        content: content
                    })
                    .success(function(response) {
                        defered.resolve(response);
                    }).error(function(response) {
                        defered.reject(!1);
                    });
                defered.promise;
            }
        }
    }])
    .factory("userSer", ["rootStr", "$http", "$q", function(rootStr, $http, $q) {
        return {
            /* 获取用户信息 */
            getUser: function(name){
                var defered = $q.defer();
                return $http.get(
                    rootStr.user + name,
                    {
                        params:{
                            mdrender: rootStr.param.mdrender
                        }
                    }
                ).success(function(response) {
                    defered.resolve(response);
                }).error(function(response) {
                    defered.reject(!1);
                });
                defered.promise;
            },
            /* 用户Token验证 */
            tokenCheck: function(accessToken){
                var defered = $q.defer();
                rootStr.author.assesstoken = accessToken;
                return $http.post(rootStr.checktoken,
                    {
                        accesstoken: rootStr.author.accesstoken
                    })
                    .success(function(response) {
                        defered.resolve(response);
                    }).error(function(response) {
                        defered.reject(!1);
                    });
                defered.promise;
            },
            /* 获取用户收藏 */
            getUserCollect: function(name){
                var defered = $q.defer();
                return $http.get(
                    rootStr.usercollect + name,
                    {
                        params:{
                            mdrender: rootStr.param.mdrender
                        }
                    }
                ).success(function(response) {
                    defered.resolve(response);
                }).error(function(response) {
                    defered.reject(!1);
                });
                defered.promise;
            },
            /* 用户收藏主题 */
            collectTopic: function(topic_id){
                var defered = $q.defer();
                return $http.post(rootStr.collect,
                    {
                        accesstoken: rootStr.author.accesstoken,
                        topic_id: topic_id
                    })
                    .success(function(response) {
                        defered.resolve(response);
                    }).error(function(response) {
                        defered.reject(!1);
                    });
                defered.promise;
            },
            /* 用户取消收藏主题 */
            uncollectTopic: function(topic_id){
                var defered = $q.defer();
                return $http.post(rootStr.uncollect,
                    {
                        accesstoken: rootStr.author.accesstoken,
                        topic_id: topic_id
                    })
                    .success(function(response) {
                        defered.resolve(response);
                    }).error(function(response) {
                        defered.reject(!1);
                    });
                defered.promise;
            },
        }
    }])
    .factory("repliesSer", ["rootStr", "$http", "$q", function(rootStr, $http, $q) {
        return {
            /* 新建评论 */
            replyNew: function(topic_id, reply_id, content){
                var param = null;
                if(reply_id){
                    param = {
                        accesstoken: rootStr.author.accesstoken,
                        content: content,
                        reply_id: reply_id
                    }
                }
                else{
                    param = {
                        accesstoken: rootStr.author.accesstoken,
                        content: content
                    }
                }
                var defered = $q.defer();
                return $http.post(rootStr.replies.replace(/:topic_id/, topic_id), param)
                    .success(function(response) {
                        defered.resolve(response);
                    }).error(function(response) {
                        defered.reject(!1);
                    });
                defered.promise;
            },
            /* 评论点赞 */
            replyUps: function(reply_id){
                var defered = $q.defer();
                return $http.post(rootStr.replyups.replace(/:reply_id/, reply_id),
                    {
                        accesstoken: rootStr.author.accesstoken
                    }
                )
                    .success(function(response) {
                        defered.resolve(response);
                    }).error(function(response) {
                        defered.reject(!1);
                    });
                defered.promise;
            },
        }
    }])
    .factory("messageSer", ["rootStr", "$http", "$q", function(rootStr, $http, $q) {
        return {
            /* 获取未读消息 */
            getMsgCount: function(){
                var defered = $q.defer();
                return $http.get(rootStr.messagecount,
                    {
                        params:{
                            accesstoken: rootStr.author.accesstoken
                        }
                    }
                ).success(function(response) {
                    defered.resolve(response);
                }).error(function(response) {
                    defered.reject(!1);
                });
                defered.promise;
            },
            /* 获取已读和未读消息 */
            getMessage: function(){
                var defered = $q.defer();
                return $http.get(rootStr.message,
                    {
                        params:{
                            accesstoken: rootStr.author.accesstoken,
                            mdrender: rootStr.param.mdrender
                        }
                    }
                ).success(function(response) {
                    defered.resolve(response);
                }).error(function(response) {
                    defered.reject(!1);
                });
                defered.promise;
            },
            /* 标记全部已读 */
            setMarkall: function(){
                var defered = $q.defer();
                return $http.post(rootStr.markall,
                    {
                        accesstoken: rootStr.author.accesstoken
                    }
                ).success(function(response) {
                    defered.resolve(response);
                }).error(function(response) {
                    defered.reject(!1);
                });
                defered.promise;
            },
            /* 标记单个消息为已读 */
            setMarkone: function(msg_id ){
                var defered = $q.defer();
                return $http.post(rootStr.markone.replace(/:msg_id/, msg_id),
                    {
                        accesstoken: rootStr.author.accesstoken
                    }
                ).success(function(response) {
                    defered.resolve(response);
                }).error(function(response) {
                    defered.reject(!1);
                });
                defered.promise;
            }
        }
    }])
    .factory("commonSer", [
        "rootStr",
        '$q',
        '$cordovaBadge',
        '$cordovaBarcodeScanner',
        function(rootStr,
                 $q,
                 $cordovaBadge,
                 $cordovaBarcodeScanner) {
        return {
            /* 设置角标提示数目 */
            setBadge: function(badgeCount){
                if($cordovaBadge) {
                    $cordovaBadge.hasPermission().then(
                        function (yes) {
                            badgeCount>0?$cordovaBadge.set(badgeCount):$cordovaBadge.clear();
                        },
                        function (no) {
                            console.log("$cordovaBadge 无配置权限");
                        });
                }
                else{
                    console.log("$cordovaBadge 插件未安装");
                }
            },
            /* 获取二维码扫描结果 */
            getScanner: function(){
                var defered = $q.defer();
                if($cordovaBarcodeScanner) {
                    $cordovaBarcodeScanner
                        .scan()
                        .then(function(barcodeData) {
                            console.log("$cordovaBarcodeScanner 扫码成功");
                            defered.resolve(barcodeData);
                        }, function(error) {
                            console.log("$cordovaBarcodeScanner 扫码失败");
                            defered.reject(!1);
                        });
                }
                else{
                    console.log("$cordovaBarcodeScanner 插件未安装");
                    defered.reject(!1);
                }
                defered.promise;
            }
        }
    }]);