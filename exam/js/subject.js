/**
 * Created by Administrator on 2016/9/22.
 * 题库模块
 */
angular.module("app.subjectModule",["ng"])
    .controller("subjectDelController",["$scope","$location","$routeParams","subjectService",
        function ($scope,$location,$routeParams,subjectService) {
        var flag = confirm("确认删除？");
        if(flag){
            subjectService.delSubject($routeParams.id,function (data) {
                alert(data);
            })
        }
        $location.path("/SubjectList/tId/0/dpId/0/levelId/0/tpId/0");
    }])
    .controller("subjectCheckController",["$scope","$location","$routeParams","subjectService",
        function ($scope,$location,$routeParams,subjectService) {
            var flag = confirm("审核不通过？");
            if(flag){
                subjectService.checkSubject($routeParams.id,$routeParams.state,function (data) {
                    alert(data);
                })
            }
            $location.path("/SubjectList/tId/0/dpId/0/levelId/0/tpId/0");
        }])
    .controller("subjectCheckController1",["$scope","$location","$routeParams","subjectService",
        function ($scope,$location,$routeParams,subjectService) {
            var flag = confirm("审核通过？");
            if(flag){
                subjectService.checkSubject($routeParams.id,$routeParams.state,function (data) {
                    alert(data);
                })
            }
            $location.path("/SubjectList/tId/0/dpId/0/levelId/0/tpId/0");
        }])
    .controller("subjectController",["$scope","SubjectCommonService","subjectService","$filter","$routeParams",
        "$location", function ($scope,SubjectCommonService,subjectService,$filter,$routeParams,$location) {
        $scope.params = $routeParams;
        $scope.isShow = false;
            $scope.key = "stem";
            $scope.value = "";
            $scope.model = {
                typeId:1,
                levelId:1,
                departmentId:1,
                topicId:1,
                stem:"",
                answer:"",
                analysis:"",
                choiceContent:[],
                choiceCorrect:[false,false,false,false]
            };
            $scope.add = function () {
                subjectService.saveSubject($scope.model,function () {
                    var model = {
                        typeId:1,
                        levelId:1,
                        departmentId:1,
                        topicId:1,
                        stem:"",
                        answer:"",
                        analysis:"",
                        choiceContent:[],
                        choiceCorrect:[false,false,false,false]
                    };
                    //重置
                    angular.copy(model,$scope.model);
                    alert("保存成功！");
                })
            };
            $scope.back = function () {
                subjectService.saveSubject($scope.model,function (data) {
                    var model = {
                        typeId:1,
                        levelId:1,
                        departmentId:1,
                        topicId:1,
                        stem:"",
                        answer:"",
                        analysis:"",
                        choiceContent:[],
                        choiceCorrect:[false,false,false,false]
                    };
                    //重置
                    angular.copy(model,$scope.model);
                    alert("data");
                });
                $location.path("/SubjectList/tId/:tId/dpId/:dpId/levelId/:levelId/tpId/:tpId");
            };
            var subjectModule = (function () {
                var obj = {};
                if($scope.params.tId!=0){
                    obj["subject.subjectType.id"] = $scope.params.tId;
                    //obj["subject.type.id"] = $scope.params.tId;
                }
                if($scope.params.dpId!=0){
                    obj["subject.deparment.id"] = $scope.params.dpId;
                }
                if($scope.params.levelId!=0){
                    //obj["subject.subjectLevel.id"] = $scope.params.tId;
                    obj["subject.subjectLevel.id"] = $scope.params.levelId;
                }
                if($scope.params.tpId!=0){
                    obj["subject.topics.id"] = $scope.params.tpId;
                }
                return obj;
            })();
        SubjectCommonService.getAllType(function (data) {
            $scope.types = data;
        });
        SubjectCommonService.getAllDepartment(function (data) {
            $scope.departments = data;
        });
        SubjectCommonService.getAllTopics(function (data) {
            $scope.topics = data;
        });
        SubjectCommonService.getAllLevels(function (data) {
            $scope.levels = data;
        });
        //调用SubjectService获取所有题目信息
            subjectService.getAllSubjects(subjectModule,function (data) {
                data.forEach(function (subject) {
                    //获取正确答案
                    if(subject.subjectType && subject.subjectType.id != 3){
                    //if(subject.type.id != 3){
                        var answer = [];
                        subject.choices.forEach(function (choice,index) {
                           if(choice.correct){
                               var no = $filter('indexToNo')(index);
                               answer.push(no);
                           }
                        });
                        //将计算出来的正确答案赋给subject.answer
                        subject.answer = answer.toString();
                    }

                });
                $scope.subjects = data;
            });
            //$rootScope.capitals = ["A","B","C","D"];
            //遍历所有的题目，计算出选择题的答案，并且将答案赋给answer

    }])
    .service("subjectService",["$http","$httpParamSerializer",function (
        $http,$httpParamSerializer) {
        this.checkSubject = function(id,state,handler){
            $http.get("http://172.16.0.5:7777/test/exam/manager/checkSubject.action",{
                params:{
                    "subject.id":id,
                    "subject.checkState":state
                }
            }).success(function (data) {
                handler(data);
            });
        };
        this.delSubject = function (id,handler) {
            $http.get("http://172.16.0.5:7777/test/exam/manager/delSubject.action",{
                params:{
                    "subject.id":id
                }
            }).success(function (data) {
                handler(data);
            })
        };
        this.getAllSubjects = function (params,handler) {
            $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjects.action",{params:params})
            //$http.get("data/subject.json",{params:params})
                .success(function (data) {
                handler(data);
            });
        };
        this.saveSubject = function (params,handler) {
            var obj = {};
            for(var key in params){
                var val = params[key];
                switch(key){
                    case "typeId":
                        obj["subject.subjectType.id"]=val;
                        break;
                    case "departmentId":
                        obj["subject.department.id"]=val;
                        break;
                    case "levelId":obj["subject.subjectLevel.id"]=val;
                        break;
                    case "topicId":
                        obj["subject.topic.id"]=val;
                        break;
                    case "stem":
                        obj["subject.stem"]=val;
                        break;
                    case "answer":
                        obj["subject.answer"]=val;
                        break;
                    case "analysis":
                        obj["subject.analysis"]=val;
                        break;
                    case "choiceContent":
                        obj["choiceContent"]=val;
                        break;
                    case "choiceCorrect":
                        obj["choiceCorrect"]=val;
                        break;
                }
            }
            obj = $httpParamSerializer(obj);
            $http.post("http://172.16.0.5:7777/test/exam/manager/saveSubject.action",obj,{
                headers:{
                    "Content-type":"application/x-www-form-urlencoded"
                }
            }).success(handler);
        }
    }])
    //公共服务，用于获取相关数据
    .factory("SubjectCommonService",["$http",function ($http) {
        return {
            getAllType:function (handler) {
                /*$http.jsonp("http://172.16.0.5:7777/test/exam/manager/getAllSubjectType.action",{
                    params:{
                        callback:"JSON_CALLBACK"
                    }
                })*/
                $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectType.action").success(function(data){
                //$http.get("data/type.json").success(function (data) {
                    handler(data);
                });
            },
            getAllDepartment:function (handler) {
                /*$http.jsonp("http://172.16.0.5:7777/test/exam/manager/getAllDepartmentes.action",{
                    params:{
                        callback:"JSON_CALLBACK"
                    }
                }).success(function(data){*/
                $http.get("http://172.16.0.5:7777/test/exam/manager/getAllDepartmentes.action").success(function(data){
                //$http.get("data/department.json").success(function (data) {
                    //data = parseJSON(data);
                    handler(data);
                });
            },
            getAllTopics:function (handler) {
                //http://172.16.0.5:7777/test/exam/manager/getAllTopics.action
                $http.get("http://172.16.0.5:7777/test/exam/manager/getAllTopics.action").success(function(data){
                //$http.get("data/topics.json").success(function (data) {
                    handler(data);
                });
            },
            getAllLevels:function (handler) {
                $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectLevel.action").success(function(data){
                //$http.get("data/level.json").success(function (data) {
                    handler(data);
                });
            }
        };
    }])
    .directive("selectOption",function () {
        return {
            restrict:"A",
            link:function (scope,element) {
                element.on("change",function () {
                    var type = element.attr("type");
                    var isCheck = element.prop("checked");
                    if(type=="radio"){
                        scope.model.choiceCorrect = [false,false,false,false];
                        var index = angular.element(this).val();
                        scope.model.choiceCorrect[index] = true;
                    }else if(type=="checkbox" && isCheck){
                        var index = angular.element(this).val();
                        scope.model.choiceCorrect[index] = true;
                    }
                    //强制刷新
                    scope.$digest();
                });
            }
        };
    })
    .filter("indexToNo",function () {
        return function (input) {
            var result ;
            switch (input){
                case 0:
                    result = 'A';
                    break;
                case 1:
                    result = 'B';
                    break;
                case 2:
                    result = 'C';
                    break;
                case 3:
                    result = 'D';
                    break;
                case 4:
                    result = 'E';
                    break;
                default:
                    result = 'F';
            }
            return result;
        }
    })
    .filter("selectTopic",function () {
        return function (input,id) {
            if(input){
                var arr = input.filter(function (item) {
                    return item.department.id == id;
                });
            }
            return arr;
        };
    });