angular.module('appMain.filter', [])
    .filter('to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }])
// https://www.cnblogs.com/puyongsong/p/6091666.html
    /*
     * 格式化HTML字符串中img标签
     * */
    .filter('imgFormatFilter', [function () {
        return function (html) {
            return html&&html.replace(/src/g, "onerror=\"this.src='image/user.png'\" class=\"dfimg1\" ng-src");
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
    .filter("dateFilter", [function(){
        return function(date){
            var createTime = new Date(date);
            var currentTime = new Date();

            var year = currentTime.getYear() - createTime.getYear();
            if(year > 0){
                return year + "年前";
            }
            var month = currentTime.getMonth() - createTime.getMonth();
            if(month > 0){
                return month + "月前";
            }
            var day = currentTime.getDate() - createTime.getDate();
            if(day > 0){
                return day + "天前";
            }
            var minutes = currentTime.getMinutes() - createTime.getMinutes();
            if(minutes > 0){
                return minutes + "分钟前";
            }else{
                return "刚刚";
            }
        }
    }]);