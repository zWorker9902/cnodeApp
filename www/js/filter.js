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
    .filter('imgCountsFilter', [function () {
        return function (html) {
            if(html){
                var imgs = html.match(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi);
                var counts = 0;
                if(imgs){
                    if(imgs.length < 3){
                        counts = 1;
                    }else{
                        counts = 3;
                    }
                }
                return counts;
            }else{
                return -1;
            }
        };
    }])
    .filter('imgSourceFilter', [function () {
        return function (html) {
            if(html){
                var imgSrcs = html.match(/(?<=(src="))[^"]*?(?=")/ig);
                if(imgSrcs){
                    if(imgSrcs.length >= 1 && imgSrcs.length <3){
                        return imgSrcs[0];
                    }else{
                        return imgSrcs;
                    }
                }else{
                    return null;
                }
            }else{
                return null;
            }
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