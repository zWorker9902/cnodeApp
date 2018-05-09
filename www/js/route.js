// 总路由模块
angular.module('app.route', [])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("tabs", {
                url: "/tab",
                "abstract": !0,
                views: {
                    "": {
                        templateUrl: "views/tabs.html"
                    },
                    "setting": {
                        templateUrl: "views/setting.html",
                        controller: 'settingCtrl'
                    }
                }
            })
            .state("tabs.home", {
                url: "/home",
                views: {
                    "home-tab": {
                        templateUrl: "views/home.html",
                        controller: 'homeCtrl'
                    }
                }
            })
            .state("tabs.find", {
                url: "/find",
                views: {
                    "find-tab": {
                        templateUrl: "views/find.html"
                    }
                }
            })
            .state("tabs.user", {
                url: "/user?name",
                views: {
                    "user-tab": {
                        templateUrl: "views/user.html",
                        controller: 'userCtrl'
                    }
                }
            })
            .state("good", {
                url: "/good",
                cache: true,//缓存配置2
                templateUrl: "views/good.html",
                controller: 'goodCtrl'
            })
            .state("share", {
                url: "/share",
                cache: true,//缓存配置2
                templateUrl: "views/share.html",
                controller: 'shareCtrl'
            })
            .state("ask", {
                url: "/ask",
                cache: true,//缓存配置2
                templateUrl: "views/ask.html",
                controller: 'askCtrl'
            })
            .state("job", {
                url: "/job",
                cache: true,//缓存配置2
                templateUrl: "views/job.html",
                controller: 'jobCtrl'
            })

            .state("details", {
                url: "/details?id",
                cache: true,//缓存配置2
                templateUrl: "views/details.html",
                controller: 'detailsCtrl'
            })
            .state("author", {
                url: "/author?name",
                cache: true,//缓存配置2
                templateUrl: "views/author.html",
                controller: 'authorCtrl'
            })
            .state("login", {
                url: "/login",
                cache: false,
                templateUrl: "views/login.html",
                controller: 'loginCtrl'
            })
            .state("joined", {
                url: "/joined?name",
                cache: false,
                templateUrl: "views/joined.html",
                controller: 'joinedCtrl'
            })
            .state("created", {
                url: "/created?name",
                cache: false,
                templateUrl: "views/created.html",
                controller: 'createdCtrl'
            })
            .state("collected", {
                url: "/collected?name",
                cache: false,
                templateUrl: "views/collected.html",
                controller: 'collectedCtrl'
            })
            .state("topic", {
                url: "/topic?id",
                templateUrl: "views/topic.html",
                controller: 'topicCtrl',
                resolve:{
                    // 在页面渲染之前，进行参数设置,获取数据时作为服务注入
                    User:function(){
                        return {
                            name:"perter",
                            email:"826415551@qq.com",
                            age:"18"
                        }
                    }
                },
            });

        //使用搜索页面作为默认视图
        $urlRouterProvider.otherwise('tab/home');
    });
