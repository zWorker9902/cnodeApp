angular.module('appMain.filter', [])
/*
 * 详情内容Img格式化
 * */
    .filter('itemImgFilter', [function () {
        return function (html) {
            return html&&html.replace(/src/g, "onerror=\"this.src='image/gif/item.gif'\" class=\"dfitem\" src");
        };
    }])
    .filter('conImgFilter', [function () {
        return function (html) {
            return html&&html.replace(/src/g, "onerror=\"this.src='image/gif/content.gif'\" class=\"dfcontent\" src");
        };
    }])
    /*
     * 详情内容Img格式化
     * */
    .filter('userImgFilter', [function () {
        return function (html) {
            return html&&html.replace(/src/g, "onerror=\"this.src='image/gif/default_user.png'\" class=\"dfuser\" src");
        };
    }])
    /*
     * 过滤HTML字符串中的所有Img标签
     * */
    .filter('imgClearFilter', [function () {
        return function (html) {
            return html&&html.replace(/<img(?:.|\s)*?>/g, '');
        };
    }])
    /*
     * 日期字符串过滤
     * */
    .filter('dateFilter', ["$window", function($window){
        return function(date){
            return $window.moment(date).fromNow();
        }
    }]);