/**
 * Created by Antonin on 18/01/2015.
 */
angular.module('gabbler.login', [

'toastr'
])

.controller('loginCtrl',['$scope', '$rootScope', '$cookieStore', '$location', 'AuthenticationService','$route','toastr',
        function ($scope, $rootScope, $cookieStore, $location, AuthenticationService, $route,toastr) {
        /*  $http.get('phones/phones.json').success(function(data) {
         $scope.phones = data;
         });*/
         //$scope.login = 'hello';
        /*$scope.orderProp = 'age';*/


            $scope.login = function () {
                $scope.dataLoading = true;
                AuthenticationService.Login($scope.username, $scope.pwd, function (response) {
                    if (response.token) {

                        //$scope.error = response.token;
                        $scope.dataLoading = false;
                        //$scope.error = $cookieStore.get("globals");
                       // $route.reload();
                        //$scope.$apply();
                        //AuthenticationService.SetCredentials($scope.username, response.token , response.userID);
                        //toastr.info($cookieStore.get("globals").currentUser.userID);
                       $location.path('/timeline/user');
                        //toastr.success('You have been connected ! ');
                    } else {

                        $scope.error = "Invalid credentials";
                        $scope.dataLoading = false;
                        toastr.error('Error while connecting ! ');
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