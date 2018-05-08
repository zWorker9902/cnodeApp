angular.module('appMain.directive', [])
    .directive('scrollTop', function() {
        return {
            restrict: 'A',
            link: function($scope, $scroller) {
                $scroller.bind('scroll', function(e) {
                    console.log("-- [" + e.detail.scrollTop + "]");
                    e.detail.scrollTop > 300 ? $(".to_top").addClass('visible'):$(".to_top").removeClass('visible');
                });
            }
        }
    })
    .directive('appSearch', function(){

        return {
            restrict: 'E',
            replace: true,
            templateUrl: './views/search.html',
            scope:false
        }

    })
    .directive('appList', function(){
        return {
            restrict: 'E',
            replace: true,
            templateUrl: './views/list.html',
            //J5   指令继承父作用域的属性和方法
            scope: true
        }
    })
    .directive('appSearchList', function(){
    return {
        restrict: 'E',
        replace: true,
        templateUrl: './views/search-list.html',
        //J5   指令继承父作用域的属性和方法，但是有自己的作用域
        scope:{
        	// 获取参数
            orgProv: '@orgProv',
            provinceList: '=provinceList',
            onSelectFun: '&onSelectFun'
        },
		link: function($scope, element, attrs){
        	$scope.searchRes = false;
            $scope.noSearchRes = false;
		},

        controller: ['$scope', function($scope){
            $scope.provinceSearch = [];

			$scope.$watch('searchKey',function(oldValue, newValue){
                $scope.searchRes = false;

                if($scope.searchKey){
                    $scope.provinceSearch = [];
                    angular.forEach($scope.provinceList, function(provItem){

                        if(provItem.name.indexOf($scope.searchKey) > -1){
                            $scope.provinceSearch.push(provItem);
                        }

                    });

                    if($scope.provinceSearch.length > 0){
                        $scope.searchRes = true;
                        $scope.noSearchRes = false;
                    }else{
                        $scope.searchRes = true;
                        $scope.noSearchRes = true;
                    }
                }else{
                    $scope.searchRes = false;
                }
			});

            $scope.searchKey = $scope.orgProv;

            $scope.onSelectCity = function(name, code){
                // $scope.onSelectFun(name);
                $scope.searchRes = false;
			}
		}]
    }
})
    .directive('appProvinceList', function(){
        return {
            restrict: 'E',
            replace: true,
            templateUrl: './views/province-list.html',
            scope:{
                // `orgProv` 就是原来元素中的`org-prov`属性
                orgProv: '@orgProv',
                data: '=provinceList', // = 双向数据绑定
                // `onSelectFun`就是原来元素中的`on-select-fun`属性
                // & 表示绑定函数
                onSelectFun: '&onSelectFun'
            },
            link: function($scope, element, elementAttrs, otherCtrl, transclude){},
        }
    });