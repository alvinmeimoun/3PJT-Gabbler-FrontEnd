/**
 * Created by Antonin on 18/01/2015.
 */
angular.module('gabbler.login', [


])

.controller('loginCtrl',['$scope', '$rootScope', '$cookieStore', '$location', 'AuthenticationService','$route',
        function ($scope, $rootScope, $cookieStore, $location, AuthenticationService, $route) {
        /*  $http.get('phones/phones.json').success(function(data) {
         $scope.phones = data;
         });*/
         //$scope.login = 'hello';
        /*$scope.orderProp = 'age';*/


            $scope.login = function () {
                $scope.dataLoading = true;
                AuthenticationService.Login($scope.username, $scope.pwd, function (response) {
                    if (response.token) {
                       AuthenticationService.SetCredentials($scope.username, response.token);
                        //$scope.error = response.token;
                        $scope.dataLoading = false;
                        //$scope.error = $cookieStore.get("globals");
                       // $route.reload();
                        //$scope.$apply();
                       $location.path('/timeline');
                    } else {
                        console.log("Erreur");
                        $scope.error = "Invalid credentials";
                        $scope.dataLoading = false;
                    }
                });
            };


    }])
.directive('login',function() {
    return {
        restrict: 'E',
        /* scope: true,
         replace: true,*/
        controller: 'loginCtrl',
        templateUrl: '/main/webapp/app/js/modules/login/login.html'
    };
});