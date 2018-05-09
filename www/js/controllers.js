// 'use strict';
angular.module('appMain.controllers', [])
    .controller('appMainCtrl', [
        '$rootScope',
        '$scope',
        '$ionicHistory',
        "$ionicModal",
        "$ionicLoading",
        "$state",
        "$timeout",
        "rootStr",
        function(
            $rootScope,
            $scope,
            $ionicHistory,
            $ionicModal,
            $ionicLoading,
            $state,
            $timeout,
            rootStr){
            try{
                console.log("-- appMain");
                $scope.showLoad = function(){
                    $ionicLoading.show({
                        template: '正在加载...'
                    });
                }
                $scope.hideLoad = function(){
                    $ionicLoading.hide();
                }

                $ionicModal.fromTemplateUrl('views/login.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    $scope.loginModal = modal;
                });

                $scope.openLogin = function(){
                    $scope.loginModal.show();
                }
                $scope.closeLogin = function(){
                    $scope.loginModal.hide();
                }

                $scope.tabs = rootStr.tabs;

                $scope.toClose = function() {
                    if($ionicHistory.backView()){
                        $scope.isBack = true;
                        $ionicHistory.goBack();
                    }else{
                        console.log("返回故障---");
                        $state.go("tabs.home");
                    }
                };
            }
            catch (error){

            }
        }])
    .controller('homeCtrl', [
        '$rootScope',
        '$scope',
        'topicsSer',
        '$ionicHistory',
        'LocalSer',
        '$timeout',
        'commonSer',
        'messageSer',
        'rootStr',
        function($rootScope,
                 $scope,
                 topicsSer,
                 $ionicHistory,
                 LocalSer,
                 $timeout,
                 commonSer,
                 messageSer,
                 rootStr){
            try{
                console.log("-- home");

                if(rootStr.author.accesstoken){
                    // 获取用户未读信息
                    messageSer.getMsgCount().then(
                        function(success){
                            commonSer.setBadge(2);
                        },
                        function(error){}
                    );
                }

                $timeout(function(){
                    /* 获取新闻列表 */
                    function topicsList(){
                        topicsSer.getTopics(1).then(
                            function(success){
                                if(success.data.success) {
                                    var topicsList = success.data.data;
                                    LocalSer.setLocal({
                                        key: "topics_cnode",
                                        data: topicsList
                                    });
                                }
                            },
                            function(error){
                                console.log("error");
                            }
                        );
                    }
                    /* 获取新闻[精华]列表 */
                    function goodList(){
                        topicsSer.getTopics(1, 'good').then(
                            function(success){
                                if(success.data.success) {
                                    var goodList = success.data.data;
                                    LocalSer.setLocal({
                                        key: "good_cnode",
                                        data: goodList
                                    });
                                }
                            },
                            function(error){
                                console.log("error");
                            }
                        );
                    }

                    /* 获取新闻[分享]列表 */
                    function shareList(){
                        topicsSer.getTopics(1, 'share').then(
                            function(success){
                                if(success.data.success) {
                                    var shareList = success.data.data;
                                    LocalSer.setLocal({
                                        key: "share_cnode",
                                        data: shareList
                                    });
                                }
                            },
                            function(error){
                                console.log("error");
                            }
                        );
                    }
                    /* 获取新闻[问答]列表 */
                    function askList(){
                        topicsSer.getTopics(1, 'ask').then(
                            function(success){
                                if(success.data.success) {
                                    var askList = success.data.data;
                                    LocalSer.setLocal({
                                        key: "ask_cnode",
                                        data: askList
                                    });
                                }
                            },
                            function(error){
                                console.log("error");
                            }
                        );
                    }
                    /* 获取新闻[招聘]列表 */
                    function jobList(){
                        topicsSer.getTopics(1, 'job').then(
                            function(success){
                                if(success.data.success) {
                                    var jobList = success.data.data;
                                    LocalSer.setLocal({
                                        key: "job_cnode",
                                        data: jobList
                                    });
                                }
                            },
                            function(error){
                                console.log("error");
                            }
                        );
                    }

                    $scope.topicsList = LocalSer.getLocal("topics_cnode") || topicsList();
                    LocalSer.getLocal("good_cnode") || goodList();
                    LocalSer.getLocal("share_cnode") || shareList();
                    LocalSer.getLocal("ask_cnode") || askList();
                    LocalSer.getLocal("job_cnode") || jobList();

                    $scope.onRefresh = function() {
                        topicsList();
                        goodList();
                        shareList();
                        askList();
                        jobList();
                        console.log();

                        $timeout(function () {
                            $scope.$broadcast("scroll.refreshComplete")
                        }, 2000);
                    };
                });

                $scope.loadMore = function(){
                    $scope.page ++;
                    topicsSer.getTopics($scope.page).then(
                        function(success){
                            if(success.data.success){
                                $scope.topics.push(success.data.data);
                            }
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        },
                        function(error){
                            console.log("error");
                        }
                    );
                }
            }
            catch(error) {
                console.log("topics error-" + error)
            }
        }])
    .controller('topicsCtrl', [
        '$rootScope',
        '$scope',
        'topicsSer',
        '$ionicHistory',
        'LocalSer',
        '$timeout',
        'commonSer',
        'messageSer',
        'rootStr',
        function($rootScope,
                 $scope,
                 topicsSer,
                 $ionicHistory,
                 LocalSer,
                 $timeout,
                 commonSer,
                 messageSer,
                 rootStr){
            try{
                console.log("-- topics");
                // 读取配置信息
                var page = 1;
                $scope.upLoad = false;
                $scope.topicsList = LocalSer.getLocal("topics_cnode");

                $scope.onRefresh = function(){
                    topicsSer.getTopics(1).then(
                        function(success){
                            if(success.data.success){
                                $scope.topics.push(success.data.data);
                            }
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        },
                        function(error){
                            console.log("error");
                        }
                    );
                }
                $scope.loadMore = function(){
                    page ++;
                    $scope.upLoad = false;
                    console.log("--["+ page+"]");
                    topicsSer.getTopics(page).then(
                        function(success){
                            if(success.data.success){
                                $scope.topicsList = $scope.topicsList.concat(success.data.data);
                                $scope.upLoad = true;
                            }

                        },
                        function(error){
                            console.log("error");
                        }
                    );
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                }
            }
            catch(error) {
                console.log("topics error-" + error)
            }
        }])
    .controller('goodCtrl', [
        '$rootScope',
        '$scope',
        'LocalSer',
        '$timeout',
        function($rootScope,
                 $scope,
                 LocalSer,
                 $timeout){
            try{
                $timeout(function(){
                    $scope.goodList = LocalSer.getLocal('good_cnode');
                });
            }
            catch (error){
                console.log("-- good error" + JSON.stringify(error));
            }
        }])
    .controller('shareCtrl', [
        '$rootScope',
        '$scope',
        'LocalSer',
        '$timeout',
        function($rootScope,
                 $scope,
                 LocalSer,
                 $timeout){
            try{
                $timeout(function(){
                    $scope.goodList = LocalSer.getLocal('good_cnode');
                });
            }
            catch (error){
                console.log("-- good error" + JSON.stringify(error));
            }
        }])
    .controller('askCtrl',[
        '$rootScope',
        '$scope',
        'LocalSer',
        '$timeout',
        function($rootScope,
                 $scope,
                 LocalSer,
                 $timeout){
            try{
                $timeout(function(){
                    $scope.goodList = LocalSer.getLocal('good_cnode');
                });
            }
            catch (error){
                console.log("-- good error" + JSON.stringify(error));
            }
        }])
    .controller('mainCtrl',[
        '$rootScope',
        '$scope',
        '$ionicHistory',
        '$timeout',
        'topicsSer',
        'commonSer',
        'messageSer',
        'rootStr',
        'LocalSer',
        '$ionicSlideBoxDelegate',
        function($rootScope,
                 $scope,
                 $ionicHistory,
                 $timeout,
                 topicsSer,
                 commonSer,
                 messageSer,
                 rootStr,
                 LocalSer,
                 $ionicSlideBoxDelegate){
            try{
                console.log("-- main");
                $scope.height = window.innerWidth / 1.94;
                $scope.width = window.innerWidth;

                $scope.advList = [
                    {title: '中国电动车网-新派电动车1', img: './image/001.jpg'},
                    {title: '中国电动车网-新派电动车2', img: './image/002.jpg'},
                    {title: '中国电动车网-新派电动车3', img: './image/003.jpg'},
                    {title: '中国电动车网-新派电动车4', img: './image/004.jpg'}
                ];

                if(rootStr.author.accesstoken){
                    // 获取用户未读信息
                    messageSer.getMsgCount().then(
                        function(success){
                            commonSer.setBadge(2);
                        },
                        function(error){}
                    );
                }

                $timeout(function(){
                    /* 获取新闻列表 */
                    function topicsList(){
                        topicsSer.getTopics(1).then(
                            function(success){
                                if(success.data.success) {
                                    var topicsList = success.data.data;
                                    LocalSer.setLocal({
                                        key: "topics_cnode",
                                        data: topicsList
                                    });
                                }
                            },
                            function(error){
                                console.log("error");
                            }
                        );
                    }
                    /* 获取新闻[精华]列表 */
                    function goodList(){
                        topicsSer.getTopics(1, 'good').then(
                            function(success){
                                if(success.data.success) {
                                    var goodList = success.data.data;
                                    LocalSer.setLocal({
                                        key: "good_cnode",
                                        data: goodList
                                    });
                                }
                            },
                            function(error){
                                console.log("error");
                            }
                        );
                    }

                    /* 获取新闻[分享]列表 */
                    function shareList(){
                        topicsSer.getTopics(1, 'share').then(
                            function(success){
                                if(success.data.success) {
                                    var shareList = success.data.data;
                                    LocalSer.setLocal({
                                        key: "share_cnode",
                                        data: shareList
                                    });
                                }
                            },
                            function(error){
                                console.log("error");
                            }
                        );
                    }
                    /* 获取新闻[问答]列表 */
                    function askList(){
                        topicsSer.getTopics(1, 'ask').then(
                            function(success){
                                if(success.data.success) {
                                    var askList = success.data.data;
                                    LocalSer.setLocal({
                                        key: "ask_cnode",
                                        data: askList
                                    });
                                }
                            },
                            function(error){
                                console.log("error");
                            }
                        );
                    }
                    /* 获取新闻[招聘]列表 */
                    function jobList(){
                        topicsSer.getTopics(1, 'job').then(
                            function(success){
                                if(success.data.success) {
                                    var jobList = success.data.data;
                                    LocalSer.setLocal({
                                        key: "job_cnode",
                                        data: jobList
                                    });
                                }
                            },
                            function(error){
                                console.log("error");
                            }
                        );
                    }

                    $scope.topicsList = LocalSer.getLocal("topics_cnode") || topicsList();
                    $scope.goodList = LocalSer.getLocal("good_cnode") || goodList();
                    $scope.shareList = LocalSer.getLocal("share_cnode") || shareList();
                    $scope.askList = LocalSer.getLocal("ask_cnode") || askList();
                    $scope.jobList = LocalSer.getLocal("job_cnode") || jobList();

                    $scope.onRefresh = function() {
                        topicsList();
                        goodList();
                        shareList();
                        askList();
                        jobList();
                        $timeout(function () {
                            $scope.$broadcast("scroll.refreshComplete")
                        }, 3000);
                    };
                });

                $scope.loadMore = function(){
                    $scope.page ++;
                    topicsSer.getTopics($scope.page).then(
                        function(success){
                            if(success.data.success){
                                $scope.topics.push(success.data.data);
                            }
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        },
                        function(error){
                            console.log("error");
                        }
                    );
                }

                /* 查看更多 */
                $scope.more = function(index){
                    $ionicSlideBoxDelegate.$getByHandle("tabSlider").slide(index);
                }
            }
            catch(error) {
                console.log("main error-" + error)
            }
        }])

    .controller('jobCtrl', ['$rootScope', '$scope',  'LocalSer',
        function($rootScope, $scope, LocalSer){
            try{
                $scope.topicList = LocalSer.getLocal('job_cnode');
            }
            catch (error){
                console.log("-- job error" + JSON.stringify(error));
            }
        }])
    .controller('detailsCtrl', [
        '$rootScope',
        '$scope',
        '$http',
        '$q',
        '$state',
        '$stateParams',
        '$ionicPopup',
        '$ionicModal',
        '$cordovaToast',
        '$ionicScrollDelegate',
        'rootStr',
        'userSer',
        'topicsSer',
        'repliesSer',
        '$ionicActionSheet',
        function($rootScope,
                 $scope,
                 $http,
                 $q,
                 $state,
                 $stateParams,
                 $ionicPopup,
                 $ionicModal,
                 $cordovaToast,
                 $ionicScrollDelegate,
                 rootStr,
                 userSer,
                 topicsSer,
                 repliesSer,
                 $ionicActionSheet){
            console.log("-- details id["+ $stateParams.id +"]");
            $scope.id = $stateParams.id;
            $scope.isCollect = false;
            $scope.article = null;

            /* 回到顶部 */
            $scope.toTop = function(){
                $ionicScrollDelegate.$getByHandle('detailsHandle').scrollTop(true);
            }

            /* 话题分享 */
            $scope.onShare = function(){
                $ionicActionSheet.show({
                    cssClass: "share-popu",
                    buttons: [
                        {text: "<img src='image/wx.png' height='40px'/><span>微信好友</span>"},
                        {text: "<img src='image/wx2.png' height='40px'/><span>朋友圈</span>"},
                        {text: "<img src='image/qqshare.png' height='40px'/><span>QQ</span>"},
                        {text: "<img src='image/qzone.png' height='40px'/><span>QQ空间</span>"}],
                    titleText: "",
                    cancelText: "取 消",
                    cancel: function() {},
                    buttonClicked: function(e) {
                        $cordovaToast.showLongBottom("选择：" + e );
                    }
                });
            }

            $scope.showLoad();
            $scope.getArticles = function(){
                topicsSer.getTopic($scope.id).then(
                    function(success){
                        $scope.article = success.data.data;
                        $scope.collect = $scope.article.is_collect;
                        $scope.hideLoad();
                    },
                    function(){
                        $scope.hideLoad();
                    }
                );
            }
            $scope.getArticles();

            $scope.onCollect = function(topic_id){
                if(rootStr.author.login){
                    if($scope.isCollect){
                        // 已收藏，发送取消收藏消息
                        userSer.uncollectTopic(topic_id).then(function(success){
                            $scope.collect = success.data.success;
                            console.log(success.data.success?"已取消收藏":"取消收藏失败");
                        });
                    }else{
                        // 未收藏，发送收藏消息
                        userSer.collectTopic(topic_id).then(function(success){
                            $scope.collect = success.data.success;
                            console.log(success.data.success?"收藏成功":"收藏失败");
                        });
                    }
                }
                else{
                    $scope.openLogin();
                }
            }
            $scope.input = {
                comment: "",
            };

            $scope.isFocus = false;
            $scope.onFocus = function(boolean){
                if(!window.user.login){
                    $scope.isFocus = boolean;
                    $("#comment").focus();
                }
                else{
                    $scope.showAlert('评论', '评论之前请登录');
                }
            }
            $scope.onSend = function(){
                // 新建评论
                repliesSer.replyNew($scope.article.id, null, $scope.input.comment).then(function(success){
                    $cordovaToast.showLongCenter("评论成功");
                });
            }

            $scope.onReply = function(e, replay_id){
                console.log("回复["+ replay_id +"]");
                e.stopPropagation();

                repliesSer.replyNew($scope.article.id, replay_id, $scope.input.comment).then(function(success){
                    $cordovaToast.showLongCenter("回复成功");
                });
            }

            $scope.onZan = function(e, replay_id){
                console.log("点赞["+ replay_id +"]");
                e.stopPropagation();

                repliesSer.replyUps(replay_id).then(function(success){
                    if(success.data.success){
                        switch(success.data.action){
                            case "down":{
                                $cordovaToast.showLongCenter("取消点赞");
                                break;
                            }
                            case "up":{
                                $cordovaToast.showLongCenter("已赞");
                                break;
                            }
                        }
                    }
                });
            }

            $scope.onAuthor = function(name){
                $state.go('author',{name: name});
            }
        }])

    .controller('authorCtrl', [
        '$rootScope',
        '$scope',
        '$state',
        '$stateParams',
        '$ionicPopup',
        'userSer',
        'LocalSer',
        function($rootScope,
                 $scope,
                 $state,
                 $stateParams,
                 $ionicPopup,
                 userSer,
                 LocalSer){
            console.log("-- author["+ $stateParams.name+"]");
            $scope.name = $stateParams.name;
            try{

            }
            catch (error){
                console.log('-- error ' + JSON.stringify(error));
            }

            $scope.getAuthor = function(){
                // 获取用户信息
                userSer.getUser($scope.name).then(
                    function(success){
                        if(success.data.success){
                            $scope.user = success.data.data;
                            LocalSer.setLocal({
                                key: "user_recent_topics",
                                data: $scope.user.recent_topics
                            });
                            LocalSer.setLocal({
                                key: "user_recent_replies",
                                data: $scope.user.recent_replies
                            });
                        }
                    },
                    function(){}
                );

                userSer.getUserCollect($scope.name).then(
                    function(success){
                        if(success.data.success){
                            $rootScope.collects = success.data.data;
                            LocalSer.setLocal({
                                key: "user_collect",
                                data: $rootScope.collects
                            });
                        }
                    },
                    function(){}
                );
            }
            $scope.getAuthor();
        }])

    .controller('topicCtrl', [
        '$rootScope',
        '$scope',
        '$state',
        '$stateParams',
        '$ionicPopup',
        function($rootScope,
                 $scope,
                 $state,
                 $stateParams,
                 $ionicPopup){
            console.log("-- topic" + $stateParams.id);
            $scope.id = $stateParams.id;

            /* topic */
            $scope.topic = {
                title: '',
                tab: 'dev',
                content: ''
            }

            $scope.onPublish = function() {
                // 发表话题
                topicsSer.pushTopic(
                    $scope.topic.title,
                    $scope.topic.tab,
                    $scope.topic.content)
                    .then(function (success) {
                        $scope.id = success.data.data.topic_id;
                        $cordovaToast.showLongCenter("发表成功");
                    });
            }

            $scope.onUpdate = function() {
                // 更新话题
                topicsSer.updateTopic(
                    $scope.id,
                    $scope.topic.title,
                    $scope.topic.tab,
                    $scope.topic.content)
                    .then(function (success) {
                        $scope.id = success.data.data.topic_id;
                        $cordovaToast.showLongCenter("发表成功");
                    });
            }
        }])
    .controller('settingCtrl', [
        '$rootScope',
        '$scope',
        'rootStr',
        'LocalSer',
        function($rootScope,
                 $scope,
                 rootStr,
                 LocalSer){
            try{
                $scope.avatar = {
                    enabled: rootStr.avatar.enabled
                };
                $scope.content = {
                    enabled: false
                };


                $scope.setAvatar = function(){
                    console.log("-- setting" + JSON.stringify($scope.setting ));
                }
            }
            catch (error){
                console.log("-- setting error" + JSON.stringify(error));
            }
        }])
    .controller('loginCtrl', [
        '$rootScope',
        '$scope',
        '$cordovaToast',
        '$http',
        '$q',
        '$state',
        '$stateParams',
        '$ionicPopup',
        'userSer',
        'commonSer',
        '$timeout',
        'rootStr',
        function($rootScope,
                 $scope,
                 $cordovaToast,
                 $http,
                 $q,
                 $state,
                 $stateParams,
                 $ionicPopup,
                 userSer,
                 commonSer,
                 $timeout,
                 rootStr){
            try{

                $scope.login = {
                    name: "",
                    pswd: ""
                }

                $scope.onScanner = function(){
                    // commonSer.getScanner().then(
                    //     function(success){
                            // var accessToken = success.data;
                            // rootStr.author.accesstoken = 'bfa787f1-09cc-42d6-90e4-d4c0616d24b4';
                            rootStr.author.login = false;
                            // 获取用户信息
                            userSer.tokenCheck('bfa787f1-09cc-42d6-90e4-d4c0616d24b4').then(
                                function(success){
                                    console.log("Success:"+ JSON.stringify(success));
                                    if(success.data.success){

                                        rootStr.author.login = true;

                                        var str1 = success.data.loginname;
                                        var str2 = success.data.id;
                                        var str3 = success.data.avatar_url;
                                        console.log('['+ success.data.loginname +']['+success.data.id+']['+success.data.avatar_url+']');

                                        $scope.closeLogin();

                                        //  confirm 对话框
                                        // var confirmPopup = $ionicPopup.confirm({
                                        //     title: '欢迎进入CNodeJS中文网',
                                        //     template: success.data.loginname
                                        // });
                                        // confirmPopup.then(function(res) {
                                        // });

                                        // $.DialogByZ.Autofade({Content:  success.data.loginname +" 欢迎进入CNodeJS中文网"});

                                        $timeout(function(){
                                            // confirmPopup.close();
                                            // $state.go('tabs/user', {
                                            //     name: success.data.loginname
                                            // });
                                        }, 3000);
                                    }
                                },
                                function(){
                                    alert("登录状态已过期，请重新登录");
                                    // $cordovaToast.showShortBottom("登录状态已过期，请重新登录")
                                }
                            );
                        }
                        // ,
                    //     function(){
                    //         $cordovaToast.showShortBottom("登录状态失败")
                    //     }
                    // );
                // }
            } catch (error){
                console.log("-- login error" + JSON.stringify(error));
            }
        }])

    .controller('userCtrl', [
        '$rootScope',
        '$scope',
        '$cordovaToast',
        '$stateParams',
        'userSer',
        'rootStr',
        function($rootScope,
                 $scope,
                 $cordovaToast,
                 $stateParams,
                 userSer,
                 rootStr){
            try{
                console.log("" + $stateParams.name);
                $scope.name = $stateParams.name;
                if($scope.name){
                    userSer.getUser($scope.name).then(
                        function(success){
                            debugger
                            if(success.data.success){
                                rootStr.author.login = true;
                            }
                        },
                        function(error){
                        }
                    );
                }

            }
            catch (error){
                console.log("-- user error" + JSON.stringify(error));
            }

        }])
.controller('joinedCtrl', [
    '$rootScope',
    '$scope',
    '$http',
    '$q',
    '$state',
    '$stateParams',
    '$ionicPopup',
    'LocalSer',
    function($rootScope, $scope, $http, $q, $state, $stateParams, $ionicPopup, LocalSer){
        console.log("-- joined" + $stateParams.name);
        $scope.title = $stateParams.name + "参与的话题";
        $scope.recent_replies = LocalSer.getLocal('user_recent_replies');
    }])
    .controller('createdCtrl', [
        '$rootScope',
        '$scope',
        '$stateParams',
        'LocalSer',
        function($rootScope, $scope,$stateParams, LocalSer){
            console.log("-- joined" + $stateParams.name);
            $scope.title = $stateParams.name + "的话题";
            $scope.recent_topics = LocalSer.getLocal('user_recent_topics');
        }])
    .controller('collectedCtrl', [
        '$rootScope',
        '$scope',
        '$stateParams',
        '$filter',
        '$log',
        'LocalSer',
        function($rootScope, $scope,$stateParams,$filter, $log,LocalSer){
            console.log("-- joined" + $stateParams.name);
            $scope.title = $stateParams.name + "的收藏";
            var collect = LocalSer.getLocal('user_collect');
            $scope.topics = [];
            angular.forEach(collect, function(topic, index){
                topic.type = $filter('imgCountsFilter')(topic.content);
                topic.imgs = $filter('imgSourceFilter')(topic.content);
                $log.info("[" + index + "] ["+ topic.type +"] ["+ topic.imgs +"]");
                $scope.topics.push(topic);
            });


        }]);

