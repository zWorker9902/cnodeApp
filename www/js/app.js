angular.module('appMain', [
    'ionic',
    'ngCordova',
    'tabSlideBox',
    'ionicLazyLoad',
    'appMain.route',
    'appMain.filter',
    'appMain.services',
    'appMain.directive',
    'appMain.controllers',
    'ion-floating-menu'
])
    .config([
        '$ionicConfigProvider', // 配置视图过渡方式
        "$compileProvider",
        "$sceDelegateProvider", // 严格的上下文转义服务
        "$stateProvider", // 路由配置服务
        function(
            $ionicConfigProvider,
            $compileProvider,
            $sceDelegateProvider,
            $stateProvider,
            $ionicNativeTransitionsProvider){
            // 配置选项卡的样式。 Android默认为striped，iOS默认为standard
            $ionicConfigProvider.tabs.style("standard");

            // 配置选项卡的位置。 Android默认为top，iOS默认为bottom。
            $ionicConfigProvider.tabs.position("bottom");

            // 配置导航栏标题的对齐方式，默认：center（居中）
            $ionicConfigProvider.navBar.alignTitle("center");

            // 配置视图间转换时的动画样式
            $ionicConfigProvider.views.transition("no");

            // 配置禁止侧滑后退事件
            $ionicConfigProvider.views.swipeBackEnabled(!1);

            // 在DOM中缓存的视图最大数量。当超过最大数量时，最开始被访问的视图将被删除
            $ionicConfigProvider.views.maxCache(3);// 缓存配置1

            // 设置在$stateProvider.state中定义的templateUrls预加载模板的最大数量。 如果设置为0，用户将在打开一个新页面时必须等待页面加载完毕 默认值30。
            $ionicConfigProvider.templates.maxPrefetch(5);

            // 配置后退按钮文字和图标
            $ionicConfigProvider.backButton.text("").icon('ion-ios-arrow-back');

            // 配置是否把以前视图的标题作为后退按钮的文本。 这是iOS的默认做法。
            $ionicConfigProvider.backButton.previousTitleText(!1);

            // 配置恢复或者覆盖白名单urls安全列表的正则表达式，主要用于阻止通过html链接进行的xss攻击。
            // 任何将要通过数据绑定到a[href]的urls首先都要经过初始化并转化为一个绝对url，如果这个url
            // 匹配aHrefSanitizationWhitelist的正则表达式规则，则会被添加到DOM中，否则转化后的url将会
            // 加上’unsafe:‘前缀后才能被加入到DOM中。
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|http|ftp|mailto|chrome-extension|tel|file):/);

            // 配置白名单，确认Angular模板所使用的资源URL是否是安全的
            $sceDelegateProvider.resourceUrlWhitelist([
                "self", // 允许同源调用
                // 允许从指定的域上调用。注意单*跟双**的区别。
                "http://*.youku.**", "http://*.tudou.**", "http://*.ddc.**", "http://*.cnev.**", "http://*.qq.**"]);

            // 配置黑名单。
            $sceDelegateProvider.resourceUrlBlacklist([
                'http://myapp.example.com/clickThru**'
            ]);
            
        }])
    .run([
        '$ionicPlatform', // 检测当前的平台
        '$cordovaNetwork',
        '$cordovaStatusbar', // 配置设备的状态栏颜色和样式
        '$cordovaToast',
        "$cordovaSplashscreen", // 启动画面插件：显示或隐藏APP启动屏幕画面
        "$rootScope",
        "$ionicLoading",
        "$cordovaAppVersion", // 用来获取开发软件的版本号
        "$cordovaFile", // 文件操作插件，访问该设备的文件和目录的插件
        "$cordovaFileOpener2", // cordova打开文件插件，这个插件将打开你的设备文件系统的文件,如apk应用程序文件，pdf文件等，还可以检测是是否安装了 一个应用
        "$ionicHistory",
        "$cordovaKeyboard",
        "rootStr",
        "LocalSer",
        "$state",
        "$http",
        "$ionicPopup",
        "$timeout",
        function(
            $ionicPlatform,
            $cordovaNetwork,
            $cordovaStatusbar,
            $cordovaToast,
            $cordovaSplashscreen,
            $rootScope,
            $ionicLoading,
            $cordovaAppVersion,
            $cordovaFile,
            $cordovaFileOpener2,
            $ionicHistory,
            $cordovaKeyboard,
            rootStr,
            LocalSer,
            $state,
            $http,
            $ionicPopup,
            $timeout
        ){
            //一旦设备就绪，则触发一个回调函数，或如果该设备已经就绪，则立即调用
            $ionicPlatform.ready(function() {
                var platformaName = ionic.Platform.platform(); // 平台名称
                var platformVersion = ionic.Platform.version(); // 平台版本
                ionic.Platform.showStatusBar(true);// 隐藏设备状态栏

                // 网络监测
                $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
                    rootStr.netState = networkState;
                });
                $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
                    rootStr.netState = networkState;
                    $cordovaToast.showShortBottom("系统已断开网络连接")
                });

                // 软件版本检测
                $rootScope.versionName = null;//定义版本号
                $http.get(rootStr.lunar).success(function(data){
                    cordova.getAppVersion.getVersionNumber().then(
                        function (version) {
                            if (rootStr.netState === Connection.WIFI) {
                                $ionicPopup.confirm({
                                    title: '版本升级',
                                    template: '发现新版本',
                                    cancelText: '取消',
                                    okText: '升级'
                                }).then(function (res) {
                                    if (res) {
                                        // 版本升级
                                    }
                                });
                            } else {
                                $ionicPopup.confirm({
                                    title: '建议您在WIFI条件下进行升级，是否确认升级？',
                                    template: '发现新版本',
                                    cancelText: '取消',
                                    okText: '升级'
                                }).then(function (res) {
                                    if (res) {
                                        // 版本升级
                                    }
                                });
                            }
                        }
                    );
                });

                /* 显示加载框 */
                $rootScope.showLoad = function(){
                    $ionicLoading.show({
                        template: 'Loading...'
                    });
                }
                $rootScope.hideLoad = function(){
                    $ionicLoading.hide();
                };

                // 需要登录验证的页面
                var needLoginView = ["myclass", "mycomment", "myfavorite", "myquestion", "orderlist"];//需要登录的页面state
                $rootScope.$on('$stateChangeStart',
                    function(event, toState, toParams, fromState, fromParams, options){
                    if(needLoginView.indexOf(toState.name) >=0 && !$rootScope.isLogin ){//判断当前是否登录
                        $state.go("login");//跳转到登录页
                        event.preventDefault(); //阻止默认事件，即原本页面的加载
                    }
                });

                // 状态栏配置
                $timeout(function(){
                    if(window.cordova){
                        if(ionic.Platform.isAndroid()){
                            $cordovaSplashscreen.hide();
                            // 启动画面已隐藏
                            setTimeout(function() {
                                // 样式: 无 : 0, 白色不透明: 1, 黑色半透明: 2, 黑色不透明: 3
                                $cordovaStatusbar.style(1);
                                $cordovaStatusbar.show();
                                // $cordovaStatusbar.show();

                                // 背景颜色名字 : black, darkGray, lightGray, white.....
                                // $cordovaStatusbar.styleColor("red");
                                // $cordovaStatusbar.styleHex("#00ff00"); // 采用十六进制设置背景颜色

                            });

                            // 是否安装软键盘插件
                            if(window.cordova.plugins.Keyboard){
                                // 默认情况下隐藏配件栏（将其删除以显示键盘上方的配件栏
                                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!0);
                            }
                        }
                    }
                },1000);
            });

            $ionicPlatform.registerBackButtonAction(function(e) {
                    if ($state.current.name.indexOf("home") > -1) {
                        if ($rootScope.backButtonPressedOnceToExit) {
                            // 保存配置信息
                            LocalSer.setLocal('setting', rootStr.setting);
                            LocalSer.getLocal('author', rootStr.author);

                            ionic.Platform.exitApp();
                        } else {
                            $rootScope.backButtonPressedOnceToExit = !0;
                            $cordovaToast.showShortBottom("再按一次退出CNodeJS中文网");
                            console.log("$state.current.name" + $state.current.name);

                            setTimeout(function () {
                                $rootScope.backButtonPressedOnceToExit = !1
                            }, 1000);
                        }
                    } else {
                        if ($ionicHistory.backView()) {
                            $rootScope.isBack = !0;
                            if ($cordovaKeyboard.isVisible()) {
                                $cordovaKeyboard.close()
                            } else {
                                $ionicHistory.goBack();
                            }
                        } else {
                            console.log("返回异常");
                            $state.go("home");
                            e.preventDefault()
                        }
                    }
                }, 1000);
        }]);