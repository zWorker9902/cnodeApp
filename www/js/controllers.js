// 'use strict';

angular.module('appMain.controllers', ['ngCordova'])
    .controller('main', [
        '$rootScope', '$scope',
        "HttpService",
        '$ionicSlideBoxDelegate',
        '$timeout',
        '$cordovaToast',
        "$cordovaFileOpener2", // cordova打开文件插件，这个插件将打开你的设备文件系统的文件,如apk应用程序文件，pdf文件等，还可以检测是是否安装了 一个应用
        "$ionicPopup",
        "$ionicActionSheet",
        "$cordovaVibration", // 震动插件
        "$cordovaBadge", // 修改应Android、ios和Windows手机应用程序桌面图标的角标数量
        "$cordovaGeolocation",
        "$cordovaLocalNotification",
        "$cordovaSms",
        "$cordovaBarcodeScanner",
        function(
            $rootScope,
            $scope,
            HttpService,
            $ionicSlideBoxDelegate,
            $timeout,
            $cordovaToast,
            $cordovaFileOpener2,
            $ionicPopup,
            $ionicActionSheet,
            $cordovaVibration,
            $cordovaBadge,
            $cordovaGeolocation,
            $cordovaLocalNotification,
            $cordovaSms,
            $cordovaBarcodeScanner
        ){
            // 窗口的文档显示区的高度和宽度，以像素计。这里的宽度和高度不包括菜单栏、工具栏以及滚动条等的高度
            $scope.height = window.innerWidth / 1.94;
            $scope.width = window.innerWidth;
            $scope.advList = [
                {title: '中国电动车网-新派电动车1', img: './image/001.jpg'},
                {title: '中国电动车网-新派电动车2', img: './image/002.jpg'},
                {title: '中国电动车网-新派电动车3', img: './image/003.jpg'},
                {title: '中国电动车网-新派电动车4', img: './image/004.jpg'}
            ];

            $scope.myAdvActiveSlide = 1;
            $scope.newsList = [
                {Title: '2015全明星中国大赛亚洲赛区2015全明星区', ImageUrl: './image/001.jpg', PostDate:"2018-2-24", Hits: "2256"},
                {Title: '2015全明星中国大赛亚洲赛区2016全明星区', ImageUrl: './image/002.jpg', PostDate:"2018-2-24", Hits: "2256"},
                {Title: '2015全明星中国大赛亚洲赛区2011全明星区', ImageUrl: './image/003.jpg', PostDate:"2018-2-24", Hits: "2256"}
            ];

            $scope.loadApp = function(){
                // 检查更新 https://www.cnblogs.com/zxj159/p/4421578.html
                // 添加本地插件 https://blog.csdn.net/vtming/article/details/70313023
                $cordovaFileOpener2.open(
                    'file:///storage/emulated/0/ionic/ionic.apk',
                    'application/vnd.android.package-archive'
                ).then(function() {
                    $cordovaToast.showLongCenter("打开APK安装对话框成功");
                }, function(err) {
                    $cordovaToast.showLongCenter("打开APK安装对话框失败");
                });
            }

            $scope.uninstallApp = function(){
                // 获得当前应用程序的名称
                cordova.getAppVersion.getPackageName().then(
                    function (packageName) {
                        $cordovaToast.showShortBottom("["+packageName+"]");
                        setTimeout(function(){
                            $cordovaFileOpener2.uninstall(
                                packageName
                            ).then(function() {
                                $cordovaToast.showLongCenter("卸载["+packageName+"]成功");
                            }, function(err) {
                                $cordovaToast.showLongCenter("卸载["+packageName+"]失败");
                            }, 3000);
                        });
                    });
            }

            $scope.appInfo = function(){
                cordova.getAppVersion.getPackageName().then(
                    function (name) {
                        $cordovaToast.showLongCenter("["+name+"]");
                    },
                    false);
            }

            $scope.showPopup = function(){
                var options = {
                    replaceLineBreaks: false, // true to replace \n by a new line, false by default
                    android: {
                        intent: '' // send SMS with the native android SMS messaging
                        //intent: '' // send SMS without open any other app
                        //intent: 'INTENT' // send SMS inside a default SMS app
                    }
                };
                $cordovaSms
                    .send("13262215037", '生日快乐', options)
                    .then(function() {
                        $cordovaToast.showLongCenter("发送短信成功");
                    }, function(error) {
                        $cordovaToast.showLongCenter("发送短信失败");
                    });
            }

            $scope.showShare = function(){
                $ionicActionSheet.show({
                    cssClass: "share-popu",
                    buttons: [
                        {
                            text: "<img src='img/fixed/wx.png' height='40px'/><span>微信好友</span>"
                        },
                        {
                            text: "<img src='img/fixed/wx2.png' height='40px'/><span>朋友圈</span>"
                        },
                        {
                            text: "<img src='img/fixed/qqshare.png' height='40px'/><span>QQ</span>"
                        },
                        {
                            text: "<img src='img/fixed/qzone.png' height='40px'/><span>QQ空间</span>"
                        }],
                    titleText: "",
                    cancelText: "取 消",
                    cancel: function() {},
                    buttonClicked: function(e) {
                        $cordovaToast.showLongBottom("选择：" + e );
                    }
                });
            }

            $scope.showPhoto = function(){
                $ionicActionSheet.show({
                    cssClass: "share-popu",
                    buttons: [
                        {
                            text: "<img src='img/fixed/wx.png' height='40px'/><span>图片</span>"
                        },
                        {
                            text: "<img src='img/fixed/wx2.png' height='40px'/><span>拍照</span>"
                        }],
                    titleText: "",
                    cancelText: "取 消",
                    cancel: function() {},
                    buttonClicked: function(e) {
                        $cordovaToast.showLongBottom("选择：" + e );
                        switch(e){
                            case 0:{
                                navigator.camera.getPicture(onSuccess, onFail, {
                                    quality: 50,
                                    destinationType: Camera.DestinationType.FILE_URI,//返回值格式:DATA_URL=0,返回作为base64编码字符串；FILE_URL=1，返回图像的URL；NATIVE_RUL=2，返回图像本机URL
                                    sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,       //设置图片来源：PHOTOLIBRARY=0，相机拍照=1，
                                    // targetWidth:100,                                  //缩放图像的宽度（像素）
                                    // targetHeight:100,                                 //缩放图像的高度（像素）
                                    saveToPhotoAlbum:true,                            //是否保存到相册
                                    correctOrientation:true                           //设置摄像机拍摄的图像是否为正确的方向
                                });
                                function onSuccess(imageURI) {
                                    $scope.cameraUrl = imageURI;
                                    $cordovaToast.showLongBottom("选择照片：" + imageURI );
                                }

                                function onFail(message) {
                                    $cordovaToast.showLongBottom("选择照片失败：" + message );
                                }
                                break;
                            }
                            case 1:{
                                navigator.camera.getPicture(onSuccess, onFail, {
                                    quality: 50,
                                    destinationType: Camera.DestinationType.FILE_URI,//返回值格式:DATA_URL=0,返回作为base64编码字符串；FILE_URL=1，返回图像的URL；NATIVE_RUL=2，返回图像本机URL
                                    sourceType: Camera.PictureSourceType.CAMERA,       //设置图片来源：PHOTOLIBRARY=0，相机拍照=1，
                                    // targetWidth:100,                                  //缩放图像的宽度（像素）
                                    // targetHeight:100,                                 //缩放图像的高度（像素）
                                    saveToPhotoAlbum:false,                            //是否保存到相册
                                    correctOrientation:true                           //设置摄像机拍摄的图像是否为正确的方向
                                });
                                function onSuccess(imageURI) {
                                    $scope.cameraUrl = imageURI;
                                    $cordovaToast.showLongBottom("拍照：" + imageURI );
                                }

                                function onFail(message) {
                                    $cordovaToast.showLongBottom("拍照失败：" + message );
                                }
                                break;
                            }
                        }

                        $ionicActionSheet.hide();
                    }
                });
            }

            $scope.fileOpration = function(){
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 1024 * 1024, function (fileSystem) {
                    // 创建文件
                    fileSystem.root.getFile('ionicApp.txt', {
                        create: true,
                        exclusive: false
                    }, function (fileEntity) {
                        //file:///data/data/io.cordova.myapp84ea27/files/files/test1.txt
                        $cordovaToast.showLongCenter("文件地址：" + fileEntity.toURL() );

                        var  strData = "勇士大胜篮网，库里神勇，砍下32分...";
                        fileEntity.createWriter(function (fileWriter) {
                            //写入结束
                            fileWriter.onwriteend = function () {
                                fileEntity.file(function (file) {
                                    var reader = new FileReader();
                                    reader.onloadend = function () {
                                        $scope.fileData = reader.result;
                                    }
                                    reader.readAsText(file);
                                }, function (err) {
                                    $cordovaToast.showLongBottom("读取文件失败:" + err);
                                });
                            }
                            fileWriter.onerror = function (e) {
                                $cordovaToast.showLongBottom('写入文件失败:' + e.toString());
                            }

                            var dataObj =  new Blob([strData], { type: 'text/plain' });
                            fileWriter.write(dataObj); // 写入数据
                        });
                    });
                });
            }

            $scope.showSchedule = function() {
                //http://www.ionic-china.com/doc/ngCordova/Local%20Notification.html
                $cordovaLocalNotification.schedule({
                    id: 1,
                    title: '小伟天气IonicApp',
                    text: '松江今天有雨，东北风1~3级，出门记得带伞哦~',
                    data: {
                        customProperty: 'custom value'
                    }
                }).then(function (result) {
                    $cordovaToast.showLongCenter(JSON.stringify(result));
                });
            }

            $scope.setBadge = function(){
                $cordovaBadge.hasPermission().then(function(yes) {
                    $cordovaBadge.get().then(function(badge) {
                        // 有权限, 已返回.
                        $scope.data = {
                            badgeCounts: badge
                        };
                        var myPopup = $ionicPopup.show({
                            template: '<input type="number" ng-model="data.badgeCounts">',
                            title: '数量',
                            subTitle: '请输入新信息提示数量',
                            scope: $scope,
                            buttons: [
                                { text: '取消' },
                                {
                                    text: '<b>确定</b>',
                                    type: 'button-positive',
                                    onTap: function(e) {
                                        if (!$scope.data.badgeCounts) {
                                            //不允许用户关闭，除非他键入wifi密码
                                            e.preventDefault();
                                        } else {
                                            return $scope.data.badgeCounts;
                                        }
                                    }
                                },
                            ]
                        });

                        myPopup.then(function(result) {
                            $cordovaToast.showLongCenter(" 数量：" +  result);
                            if(result == 0){
                                $cordovaBadge.clear().then(function() {}, function(err) {});
                            }else{
                                $cordovaBadge.set(result).then(function() {}, function(err) {});
                            }
                            myPopup.close();
                        });
                    }, function(error) {
                        $cordovaToast.showLongCenter("角标配置失败:" + error);
                    });
                }, function(error) {
                    // 无权限
                    $cordovaToast.showLongCenter("角标无配置权限:" + error);
                });
            }

            $scope.onScreenShot = function(){
                navigator.screenshot.save(function(error, res){
                    if(error){
                        $cordovaToast.showLongCenter("截屏失败:" + error);
                    }else{
                        $cordovaToast.showLongCenter("截屏成功:" + res.filePath);
                    }
                },'jpg', 50);
            }
            $scope.showSms = function(){
                var options = {
                    replaceLineBreaks: false, // true to replace \n by a new line, false by default
                    android: {
                        intent: '' // send SMS with the native android SMS messaging
                        //intent: '' // send SMS without open any other app
                        //intent: 'INTENT' // send SMS inside a default SMS app
                    }
                };
                $cordovaSms
                    .send("13262215037", '生日快乐', options)
                    .then(function() {
                        $cordovaToast.showLongCenter("发送短信成功");
                    }, function(error) {
                        $cordovaToast.showLongCenter("发送短信失败");
                    });
            }
            $scope.onLocation = function(){
                baidumap_location.getCurrentPosition(function (result) {
                    $cordovaToast.showLongCenter("定位成功：" + result.city +
                        ":" + result.district +
                        ":" + result.addr);
                }, function (error) {
                    $cordovaToast.showLongCenter("定位失败：" + JSON.stringify(error));
                });
            }

            $scope.download = function(){
                var fileTransfer = new FileTransfer();
                //下载地址;
                var source="http://apk.00v4.com/GameCity_yhgj_wxnewhj.apk";
                var target="file:///storage/emulated/0/ionic/ionic.apk";
                var trustAllHosts = true;
                var options = {};
                fileTransfer.download(source,
                    target,
                    function(resout){
                        $ionicLoading.hide();
                        $cordovaToast.showLongCenter("下载成功:" + JSON.stringify(resout));
                    },
                    function(error){
                        $cordovaToast.showLongCenter("下载失败:" + JSON.stringify(error));
                    },trustAllHosts,options);

                fileTransfer.onprogress = function(progressEvent){
                    if (progressEvent.lengthComputable){
                        $ionicLoading.show({
                            template: "已经下载：" +Math.floor((progressEvent.loaded / progressEvent.total)*100) + "%"
                        });
                    }
                }
            }

            $scope.onCreateQrCode = function(){
                $cordovaBarcodeScanner
                    .encode(barcodeScanner.Encode.TEXT_TYPE, "http://www.baidu.com")
                    .then(function(success) {
                        $cordovaToast.showLongCenter("生成二维码成功:" + JSON.stringify(success));
                    }, function(error) {
                        $cordovaToast.showLongCenter("生成二维码失败:" + JSON.stringify(error));
                    });
            }

            $scope.onCodeScanner = function(){
                $cordovaBarcodeScanner
                    .scan()
                    .then(function(barcodeData) {
                        $cordovaToast.showLongCenter("扫码成功:" + JSON.stringify(barcodeData));
                    }, function(error) {
                        $cordovaToast.showLongCenter("扫码失败:" + JSON.stringify(error));
                    });
            }


            // 48小时阅读排行
            $scope.parseTopNews = function() {
                HttpService.get48HoursTopViewPosts(10).then(function (data) {
                    $scope.topNews = [];
                    if (window.DOMParser){
                        var xmlDoc = (new DOMParser()).parseFromString(data, "text/xml");
                        var cmEntrys = xmlDoc.getElementsByTagName('entry');
                        angular.forEach(cmEntrys, function (entry, index, mEntrys) {
                            var author = entry.getElementsByTagName('author')[0];
                            $scope.topNews.push({
                                id: entry.getElementsByTagName('id')[0].firstChild.nodeValue,
                                title: entry.getElementsByTagName('title')[0].firstChild.nodeValue,
                                summary: entry.getElementsByTagName('summary')[0].firstChild.nodeValue,
                                published: entry.getElementsByTagName('published')[0].firstChild.nodeValue,
                                updated:entry.getElementsByTagName('updated')[0].firstChild.nodeValue,
                                author:{
                                    name: author.getElementsByTagName('name')[0].firstChild.nodeValue,
                                    uri: author.getElementsByTagName('uri')[0].firstChild.nodeValue,
                                    // avatar: author.getElementsByTagName('avatar')[0].firstChild.nodeValue
                                    avatar: 'image/001.jpg'
                                },
                                link:entry.getElementsByTagName('link')[0].getAttribute('href'),
                                diggs:entry.getElementsByTagName('diggs')[0].firstChild.nodeValue,
                                views:entry.getElementsByTagName('views')[0].firstChild.nodeValue,
                                comments:entry.getElementsByTagName('comments')[0].firstChild.nodeValue,
                            });
                        });
                    }
                }, function (error) {
                    $scope.topNews = null;
                });
            }
            $scope.parseTopNews();

        }])
    .controller("newDetailsCtrl", [
        "$scope",
        "$rootScope",
        "$stateParams",
        "$ionicHistory",
        "$ionicLoading",
        "$cordovaNetwork",
        "$state",
        "$timeout",
        "HttpService",
        "User",
        function(
            $scope,
            $rootScope,
            $stateParams,
            $ionicHistory,
            $ionicLoading,
            $cordovaNetwork,
            $state,
            $timeout,
            HttpService,
            User
        ){
            console.log("预配置数据：" + JSON.stringify(User));

            $rootScope.userLogin = false;

            $scope.loadData = false;
            $scope.isFocus = false;
            $scope.netState = $cordovaNetwork.getNetwork();

            $scope.$watch('loadData', function(newValue, oldValue) {
                if(newValue == true){
                    $ionicLoading.hide();
                }else{
                    $ionicLoading.show({
                        template: '正在加载...'
                    });
                }
            });

            $scope.onBack = function(){
                $ionicHistory.goBack();//返回上一个页面
            };

            // 获取文章信息
            $scope.parsePostBody = function(newID) {
                HttpService.getBlogPostBody(10).then(function (data) {
                    $scope.bodyDetails = data;
                    $scope.loadData = true;
                }, function (error) {
                    $scope.bodyDetails = null;
                    $scope.loadData = false;
                });
            }

            // 获取文章评论
            $scope.parseComments = function(){
                HttpService.getBlogPostComments(20012).then(function (data) {
                    $scope.blogComments = [];
                    if (window.DOMParser){
                        var xmlDoc = (new DOMParser()).parseFromString(data, "text/xml");
                        var cmEntrys = xmlDoc.getElementsByTagName('entry');
                        angular.forEach(cmEntrys, function (entry, index, mEntrys) {
                            var author = entry.getElementsByTagName('author')[0];
                            $scope.blogComments.push({
                                id: entry.getElementsByTagName('id')[0].firstChild.nodeValue,
                                published: entry.getElementsByTagName('published')[0].firstChild.nodeValue,
                                updated:entry.getElementsByTagName('published')[0].firstChild.nodeValue,
                                author:{
                                    name: author.getElementsByTagName('name')[0].firstChild.nodeValue,
                                    uri: author.getElementsByTagName('uri')[0].firstChild.nodeValue
                                },
                                content:entry.getElementsByTagName('content')[0].firstChild.nodeValue,
                            });
                        });
                    }
                }, function (error) {
                    $scope.blogComments = null;
                });
            }

            $scope.onFocus = function(focus){
                $scope.isFocus = focus;
            }

            // 获取新闻ID
            $scope.newID = $stateParams.newID;
            $timeout(function(){
                $scope.parsePostBody($scope.newID);
                $scope.parseComments($scope.newID);
            }, 1000);

            $scope.toLogin = function(){
                if($rootScope.userLogin == false){
                    $state.go('userLogin', {});
                }
            };
        }])
    .controller('appMainCtrl', [
        '$rootScope',
        '$scope',
        'topicsSer',
        '$q',
        '$ionicHistory',
        'LocalSer',
        '$timeout',
        'commonSer',
        'messageSer',
        'rootStr',
        "$state",
        "$ionicModal",
        function(
            $rootScope,
            $scope,
            topicsSer,
            $q,
            $ionicHistory,
            LocalSer,
            $timeout,
            commonSer,
            messageSer,
            rootStr,
            $state,
            $ionicModal){
            try{
                console.log("-- appMain");

                // // var reTag = /<img(?:.|\s)*?>/g;
                // var str = '<div><img src="images/picture1.png"><img src="images/picture2.png">234</div>'
                //
                // var re=/<img.+?>/ig;
                // var imgs = str.match(/<img.+?>/ig);
                // var re2 = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
                // angular.forEach(imgs, function(img){
                //     console.log(img.match(re2)[1]); // 获取Src属性
                // });
                // console.log(str.replace(/src/g, "onerror=\"this.src='image/user.png'\" class=\"dfimg1\" ng-src"));

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
                console.log("-- appMain --");
            }
            catch (error){

            }
        }])
    .controller('homeCtrl', ['$rootScope', '$scope', 'topicsSer', '$q',
        '$ionicHistory', 'LocalSer', '$timeout','commonSer', 'messageSer', 'rootStr',
        function($rootScope, $scope, topicsSer, $q, $ionicHistory, LocalSer, $timeout, commonSer, messageSer, rootStr){
            try{
                $scope.tabs = rootStr.tabs;
                $scope.onFinishRender = function(){

                }
            }
            catch (error){

            }
    }])

    .controller('topicsCtrl', ['$rootScope', '$scope', 'topicsSer', '$q',
        '$ionicHistory', 'LocalSer', '$timeout','commonSer', 'messageSer', 'rootStr',
        function($rootScope, $scope, topicsSer, $q, $ionicHistory, LocalSer, $timeout, commonSer, messageSer, rootStr){
            try{
                console.log("-- topics");
                // 读取配置信息
                var setting = LocalSer.getLocal('setting');
                if(setting){
                    rootStr.setting = setting;
                }

                // 读取用户信息
                var author = LocalSer.getLocal('author');
                if(author){
                    rootStr.author = author;
                }

                if(rootStr.author.accesstoken){
                    // 获取用户未读信息
                    messageSer.getMsgCount().then(
                        function(success){
                            commonSer.setBadge(2);
                        },
                        function(error){}
                    );
                }

                $scope.height = window.innerWidth / 1.94;
                $scope.width = window.innerWidth;

                $scope.advList = [
                    {title: '中国电动车网-新派电动车1', img: './image/001.jpg'},
                    {title: '中国电动车网-新派电动车2', img: './image/002.jpg'},
                    {title: '中国电动车网-新派电动车3', img: './image/003.jpg'},
                    {title: '中国电动车网-新派电动车4', img: './image/004.jpg'}
                ];

                $timeout(function(){
                    function topicsList(){
                        topicsSer.getTopics(1).then(
                            function(success){
                                if(success.data.success) {
                                    $scope.topicsList = success.data.data;

                                    angular.forEach($scope.topicsList, function(topic, index){
                                        topic.imgs = angular.element(topic.content).find('img').remove();
                                        topic.type = topic.imgs.length;
                                    });


                                    LocalSer.setLocal({
                                        key: "topics_cnode",
                                        data: $scope.topicsList
                                    });
                                }
                            },
                            function(error){
                                console.log("error");
                            }
                        );
                    }

                    function goodList(){
                        topicsSer.getTopics(1, 'good').then(
                            function(success){
                                if(success.data.success) {
                                    $scope.goodList = success.data.data;
                                    LocalSer.setLocal({
                                        key: "good_cnode",
                                        data: $scope.goodList
                                    });
                                }
                            },
                            function(error){
                                console.log("error");
                            }
                        );
                    }
                    function shareList(){
                        topicsSer.getTopics(1, 'share').then(
                            function(success){
                                if(success.data.success) {
                                    $scope.shareList = success.data.data;
                                    LocalSer.setLocal({
                                        key: "share_cnode",
                                        data: $scope.shareList
                                    });
                                }
                            },
                            function(error){
                                console.log("error");
                            }
                        );
                    }
                    function askList(){
                        topicsSer.getTopics(1, 'ask').then(
                            function(success){
                                if(success.data.success) {
                                    $scope.askList = success.data.data;
                                    LocalSer.setLocal({
                                        key: "ask_cnode",
                                        data: $scope.askList
                                    });
                                }
                            },
                            function(error){
                                console.log("error");
                            }
                        );
                    }
                    function jobList(){
                        topicsSer.getTopics(1, 'job').then(
                            function(success){
                                if(success.data.success) {
                                    $scope.jobList = success.data.data;
                                    LocalSer.setLocal({
                                        key: "job_cnode",
                                        data: $scope.jobList
                                    });
                                }
                            },
                            function(error){
                                console.log("error");
                            }
                        );
                    }

                    $scope.topicsList = LocalSer.getLocal("topics_cnode");
                    topicsList();
                    $scope.goodList = LocalSer.getLocal("good_cnode");
                    goodList();
                    $scope.shareList = LocalSer.getLocal("share_cnode");
                    shareList();
                    $scope.askList = LocalSer.getLocal("ask_cnode");
                    askList();
                    $scope.jobList = LocalSer.getLocal("job_cnode");
                    jobList();

                    $scope.onRefresh = function() {
                        topicsList();
                        goodList();
                        shareList();
                        askList();
                        jobList();
                        $timeout(function () {
                            $scope.$broadcast("scroll.refreshComplete")
                        }, 300);
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


            // $scope.onRefresh();
        }])
    .controller('goodCtrl', ['$rootScope', '$scope',
        '$state', '$stateParams', '$ionicPopup', '$ionicModal', 'LocalSer',
        function($rootScope, $scope,$state, $stateParams, $ionicPopup, $ionicModal, LocalSer){
            try{
                $timeout(function(){
                    $scope.goodList = LocalSer.getLocal('good_cnode');
                });
            }
            catch (error){
                console.log("-- good error" + JSON.stringify(error));
            }
        }])
    .controller('shareCtrl', ['$rootScope', '$scope',
        '$state', '$stateParams', '$ionicPopup', '$ionicModal', 'LocalSer',
        function($rootScope, $scope,$state, $stateParams, $ionicPopup, $ionicModal, LocalSer){
            try{
                $timeout(function(){
                    $scope.goodList = LocalSer.getLocal('share_cnode');
                });
            }
            catch (error){
                console.log("-- share error" + JSON.stringify(error));
            }
        }])
    .controller('askCtrl',['$rootScope', '$scope',
        '$state', '$stateParams', '$ionicPopup', '$ionicModal', 'LocalSer',
        function($rootScope, $scope,$state, $stateParams, $ionicPopup, $ionicModal, LocalSer){
            try{
                $timeout(function(){
                    $scope.goodList = LocalSer.getLocal('ask_cnode');
                });
            }
            catch (error){
                console.log("-- ask error" + JSON.stringify(error));
            }
        }])
    .controller('mainCtrl',['$rootScope', '$scope', '$ionicSlideBoxDelegate', '$timeout',
        'topicsSer','LocalSer',
        function($rootScope, $scope, $ionicSlideBoxDelegate, $timeout,topicsSer, LocalSer){
            console.log("-- main");
            try{
                $scope.height = window.innerWidth / 1.94;
                $scope.width = window.innerWidth;

                $scope.advList = [
                    {title: '中国电动车网-新派电动车1', img: './image/001.jpg'},
                    {title: '中国电动车网-新派电动车2', img: './image/002.jpg'},
                    {title: '中国电动车网-新派电动车3', img: './image/003.jpg'},
                    {title: '中国电动车网-新派电动车4', img: './image/004.jpg'}
                ];

                $timeout(function(){
                    function topicsList(){
                        topicsSer.getTopics(1).then(
                            function(success){
                                if(success.data.success) {
                                    $scope.topicsList = success.data.data;

                                    angular.forEach($scope.topicsList, function(topic, index){
                                        topic.imgs = angular.element(topic.content).find('img').remove();
                                        topic.type = topic.imgs.length;
                                    });


                                    LocalSer.setLocal({
                                        key: "topics_cnode",
                                        data: $scope.topicsList
                                    });
                                }
                            },
                            function(error){
                                console.log("error");
                            }
                        );
                    }

                    function goodList(){
                        topicsSer.getTopics(1, 'good').then(
                            function(success){
                                if(success.data.success) {
                                    $scope.goodList = success.data.data;
                                    LocalSer.setLocal({
                                        key: "good_cnode",
                                        data: $scope.goodList
                                    });
                                }
                            },
                            function(error){
                                console.log("error");
                            }
                        );
                    }
                    function shareList(){
                        topicsSer.getTopics(1, 'share').then(
                            function(success){
                                if(success.data.success) {
                                    $scope.shareList = success.data.data;
                                    LocalSer.setLocal({
                                        key: "share_cnode",
                                        data: $scope.shareList
                                    });
                                }
                            },
                            function(error){
                                console.log("error");
                            }
                        );
                    }
                    function askList(){
                        topicsSer.getTopics(1, 'ask').then(
                            function(success){
                                if(success.data.success) {
                                    $scope.askList = success.data.data;
                                    LocalSer.setLocal({
                                        key: "ask_cnode",
                                        data: $scope.askList
                                    });
                                }
                            },
                            function(error){
                                console.log("error");
                            }
                        );
                    }
                    function jobList(){
                        topicsSer.getTopics(1, 'job').then(
                            function(success){
                                if(success.data.success) {
                                    $scope.jobList = success.data.data;
                                    LocalSer.setLocal({
                                        key: "job_cnode",
                                        data: $scope.jobList
                                    });
                                }
                            },
                            function(error){
                                console.log("error");
                            }
                        );
                    }

                    $scope.topicsList = LocalSer.getLocal("topics_cnode");
                    topicsList();
                    $scope.goodList = LocalSer.getLocal("good_cnode");
                    goodList();
                    $scope.shareList = LocalSer.getLocal("share_cnode");
                    shareList();
                    $scope.askList = LocalSer.getLocal("ask_cnode");
                    askList();
                    $scope.jobList = LocalSer.getLocal("job_cnode");
                    jobList();

                    $scope.onRefresh = function() {
                        topicsList();
                        goodList();
                        shareList();
                        askList();
                        jobList();
                        $timeout(function () {
                            $scope.$broadcast("scroll.refreshComplete")
                        }, 300);
                    };
                });

                /* 查看更多 */
                $scope.more = function(index){
                    $ionicSlideBoxDelegate.$getByHandle("tabSlider").slide(index);
                }
            }
            catch (error){
                console.log("-- ask error" + JSON.stringify(error));
            }
        }])
    .controller('jobCtrl', ['$rootScope', '$scope',
        '$state', '$stateParams', '$ionicPopup', '$ionicModal', 'LocalSer',
        function($rootScope, $scope,$state, $stateParams, $ionicPopup, $ionicModal, LocalSer){
            try{
                $timeout(function(){
                    $scope.goodList = LocalSer.getLocal('job_cnode');
                });
            }
            catch (error){
                console.log("-- job error" + JSON.stringify(error));
            }
        }])
    .controller('detailsCtrl', ['$rootScope', '$scope',
        '$http', '$q', '$state', '$stateParams',
        '$ionicPopup', '$ionicModal', '$cordovaToast',
        '$ionicScrollDelegate', 'rootStr', 'userSer', 'topicsSer',
        function($rootScope, $scope, $http, $q, $state,
                 $stateParams, $ionicPopup, $ionicModal, $cordovaToast,
                 $ionicScrollDelegate, rootStr, userSer, topicsSer){
            console.log("-- details id["+ $stateParams.id +"]");
            $scope.id = $stateParams.id;

            // 滚动到顶部
            $scope.toTop = function(){
                $ionicScrollDelegate.$getByHandle('detailHandle').scrollTop(true);
            }

            // 收藏文章
            $scope.onCollect = function(){
                if(rootStr.author.login){
                    userSer.collectTopic().then(function(success){
                        $scope.collect = success.data.success;
                        $cordovaToast.showLongCenter("收藏成功");
                    });
                }
            }

            // 取消收藏
            $scope.onUnCollect = function(){
                if(rootStr.author.login){
                    userSer.collectTopic().then(function(success){
                        $scope.collect = success.data.success;
                        $cordovaToast.showLongCenter("已取消收藏");
                    });
                }
            }

            $scope.article = null;
            $scope.getArticles = function(){
                topicsSer.getTopic($scope.id).then(
                    function(success){
                        $scope.article = success.data.data;
                        $scope.collect = $scope.article.is_collect;
                    },
                    function(){}
                );
            }
            $scope.getArticles();

            $scope.showAlert = function(title, template, callbackFunc) {
                var alertPopup = $ionicPopup.alert({
                    title: title,
                    template: template
                });
                alertPopup.then(function(res) {
                    if(callbackFunc){
                        callbackFunc();
                    }
                });
            };

            $scope.isCollect = false;
            $scope.onCollect = function(id){
                if(window.user.login){
                    if( $scope.isCollect){
                        // 已收藏，发送取消收藏消息
                        $http.post(window.cnodeAPI.uncollect,
                            /*请求发送的数据*/
                            {
                                accesstoken : "bfa787f1-09cc-42d6-90e4-d4c0616d24b4",
                                topic_id : id
                            },
                            /*请求配置的参数*/
                            {
                                timeout: 3000
                            }
                        )
                            .success(function(data) {
                                debugger
                                if(data.success){
                                    $scope.isCollect = false;
                                }
                            })
                            .error(function(err) {
                                //错误代码
                            });
                    }else{
                        // 未收藏，发送收藏消息
                        $http.post(window.cnodeAPI.collect,
                            {
                                accesstoken : "bfa787f1-09cc-42d6-90e4-d4c0616d24b4",
                                topic_id : id
                            },{}
                        )
                            .success(function(data) {
                                debugger
                                if(data.success){
                                    $scope.showAlert('收藏', '收藏成功，可在我的收藏中查看信息');
                                    $scope.isCollect = true;
                                    $scope.collectText = "取消收藏";
                                }
                            })
                            .error(function(err) {
                                //错误代码
                            });
                    }
                }
                else{
                    // $scope.showAlert('收藏', '收藏之前请登录');
                    // $state.go('login');
                    $scope.openLogin();
                }
            }

            // 获取用户收藏的主题
            $http.get(window.cnodeAPI.usercollect + "zWorker9902",{
                params: {}
            }).success(function(response, status, headers, config){
                $scope.userCollect = response.data;
                // 检测该文章是否已收藏
                $.each($scope.userCollect, function(index, item){
                    if($scope.id.toLowerCase == item.id.toLowerCase){
                        $scope.isCollect = true;
                        return false;
                    }
                });
            }).error(function(data,status,headers,config){
            });


            $ionicModal.fromTemplateUrl('modal.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal = modal;
            });
            $scope.openModal = function($event) {
                $scope.modal.show($event);
            };
            $scope.closeModal = function() {
                $scope.modal.hide();
            };


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
                $http.post(window.cnodeAPI.replies.replace(/topic_id/, $scope.article.id),
                    {
                        accesstoken : "bfa787f1-09cc-42d6-90e4-d4c0616d24b4",
                        content: $scope.input.comment
                    }, {})
                    .success(function(data) {
                        console.log(data);
                        $scope.getArticles();
                    })
                    .error(function(err) {
                        //错误代码
                    });
            }

            $scope.pushTopic = function(newTopic){
                $http.post(window.cnodeAPI.topics,
                    {
                        accesstoken: "bfa787f1-09cc-42d6-90e4-d4c0616d24b4",
                        title: newTopic.title,
                        content: newTopic.content,
                        tab: "dev"
                    },{})
                    .success(function(data) {
                        debugger
                        if(data.success){
                            $scope.showAlert('新建主题', '新建主题成功');
                        }
                    })
                    .error(function(err) {
                        //错误代码
                    });
            }

            $scope.onReply = function(e, replay_id){
                console.log("回复["+ replay_id +"]");
                e.stopPropagation();

                // 新建评论
                $http.post(window.cnodeAPI.replies.replace(/topic_id/, $scope.article.id),
                    {
                        accesstoken : window.user.accesstoken,
                        content: $scope.input.comment,
                        reply_id: replay_id
                    },
                    {})
                    .success(function(data) {
                        console.log(data);
                        $scope.getArticles();
                    })
                    .error(function(err) {
                        //错误代码
                    });
            }

            $scope.onZan = function(e, replay_id){
                console.log("点赞["+ replay_id +"]");
                e.stopPropagation();

                $http.post(window.cnodeAPI.replyups.replace(/reply_id/, replay_id),
                    {
                        accesstoken : window.user.accesstoken,
                        content: $scope.input.comment,
                        reply_id: replay_id
                    },
                    {})
                    .success(function(data) {
                        console.log(JSON.stringify(data));
                        debugger
                    })
                    .error(function(err) {
                        //错误代码
                    });
            }

            $scope.onUser = function(name){
                $state.go('author',{name: name});
            }

        }])
    .controller('authorCtrl', ['$rootScope', '$scope', '$http', '$q', '$state', '$stateParams', '$ionicPopup',
        function($rootScope, $scope, $http, $q, $state, $stateParams, $ionicPopup){
            console.log("-- author");
            console.log("name["+ $stateParams.name+"]");

            $scope.getAuthor = function(){
                // 获取用户信息
                $http.get(window.cnodeAPI.user +  $stateParams.name,{
                    params: {
                        mdrender: true
                    }
                })
                    .success(function(response, status, headers, config){
                        $rootScope.user = response.data;
                    })
                    .error(function(data,status,headers,config){
                    });

                // 获取用户收藏
                $http.get(window.cnodeAPI.usercollect +  $stateParams.name,{
                    params: {
                        mdrender: true
                    }
                })
                    .success(function(response, status, headers, config){
                        $rootScope.collects = response.data;
                    })
                    .error(function(data,status,headers,config){
                    });
            }
            $scope.getAuthor();
        }])


    .controller('dynamicCtrl', ['$rootScope', '$scope', '$http', '$q', '$state', '$stateParams', '$ionicPopup',
        function($rootScope, $scope, $http, $q, $state, $stateParams, $ionicPopup){
            console.log("-- dynamic" + $stateParams.type);
            $scope.type = $stateParams.type;
            $scope.collects = $rootScope.collects;
            $scope.recent_topics = $rootScope.user.recent_topics;
            $scope.recent_replies = $rootScope.user.recent_replies;

            $scope.changeTab = function(type){
                $scope.type = type;
            }

        }])
    .controller('topicCtrl', ['$rootScope', '$scope', '$http', '$q', '$state', '$stateParams', '$ionicPopup',
        function($rootScope, $scope, $http, $q, $state, $stateParams, $ionicPopup){
            console.log("-- topic" + $stateParams.id);
            $scope.id = $stateParams.id;

            /* topic */
            $scope.topic = {
                tite: '',
                tab: 'dev',
                content: ''
            }

            $scope.onSetTab = function(tab){
                $scope.topic.tab = tab;
                console.log($scope.topic.tab + "" + tab);
            }

            $scope.onPublish = function(){
                if(!$scope.id){
                    // 发表话题
                    $http.post(window.cnodeAPI.topics,
                        {
                            accesstoken: window.cnodeAPI.accesstoken,
                            title: $scope.topic.tite,
                            tab: $scope.topic.tab,
                            content: $scope.topic.content
                        },{})
                        .success(function(data) {
                            if(data.success){
                                // 发布成功，获取ID
                                $scope.id = data.topic_id;
                            }
                        })
                        .error(function(err) {
                            console.log("error ["+JSON.stringify(err)+"]");
                        });
                }else{
                    // 更新话题
                    $http.post(window.cnodeAPI.topics,
                        {
                            accesstoken: window.cnodeAPI.accesstoken,
                            title: $scope.topic.tite,
                            tab: $scope.topic.tab,
                            content: $scope.topic.content
                        },{})
                        .success(function(data) {
                            if(data.success){
                                // 发布成功，获取ID
                                $scope.id = data.topic_id;
                            }
                        })
                        .error(function(err) {
                            console.log("error ["+JSON.stringify(err)+"]");
                        });
                }

            }

            $scope.$on("$ionicView.beforeEnter", function() {

            });

        }])
    .controller('settingCtrl', ['$rootScope', '$scope', '$http', '$q', '$state', '$stateParams', '$ionicPopup',
        function($rootScope, $scope, $http, $q, $state, $stateParams, $ionicPopup){
            console.log("-- setting" + $stateParams.id);

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
        function($rootScope,
                 $scope,
                 $cordovaToast,
                 $http,
                 $q,
                 $state,
                 $stateParams,
                 $ionicPopup,
                 userSer,
                 commonSer){
            try{

                $scope.login = {
                    name: "",
                    pswd: ""
                }

                $scope.onScanner = function(){
                    commonSer.getScanner().then(
                        function(success){
                            var accessToken = success.data;
                            // 获取用户信息
                            userSer.tokenCheck(accessToken).then(
                                function(success){
                                    console.log("Success:"+ JSON.stringify(success));
                                },
                                function(){
                                    $cordovaToast.showShortBottom("登录状态已过期，请重新登录")
                                }
                            );
                        },
                        function(){
                            $cordovaToast.showShortBottom("登录状态失败")
                        }
                    );
                }
            } catch (error){
                console.log("-- login error" + JSON.stringify(error));
            }
        }]);