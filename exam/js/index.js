/**
 * Created by Administrator on 2016/9/22.
 * 项目的核心js
 */
//错侧导航的动画
$(function () {
    //收缩全部
    $(".baseUI>li>ul").slideUp("fast");
    //为超级链接绑定事件
    $(".baseUI>li>a").off("click");
    $(".baseUI>li>a").on("click",function () {
        $(".baseUI>li>ul").slideUp();
        $(this).next().slideDown();
    });
    //设置默认的动画
    $(".baseUI>li>a").eq(0).trigger("click");
    $(".baseUI ul>li").off("click");
    $(".baseUI ul>li").on("click",function () {
        if(!$(this).hasClass("current")){
            //移除原来的current
            //$(".baseUI ul>li").removeClass("current");
            $(this).addClass("current");
            $(this).siblings().removeClass("current");
        }
    });
    //模拟点击全部题目
    $(".baseUI ul>li").eq(0).find("a").trigger("click");
});

angular.module("app",["ng","ngRoute","app.subjectModule"])
    .controller("mainController",["$scope",function ($scope) {

    }])
    .config(["$routeProvider",function ($routeProvider) {
        $routeProvider.when("/SubjectList/tId/:tId/dpId/:dpId/levelId/:levelId/tpId/:tpId",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectController"
        }).when("/SubjectDel/id/:id",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectDelController"
        }).when("/SubjectAdd",{
            templateUrl:"tpl/subject/subjectAdd.html",
            controller:"subjectController"
        }).when("/SubjectCheck/id/:id/state/:state",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectCheckController"
        }).when("/SubjectCheck1/id/:id/state/:state",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectCheckController1"
        }).when("/PaperAdd",{
            templateUrl:"tpl/paper/subjectList.html",
            controller:"subjectCheckController1"
        });
    }]);