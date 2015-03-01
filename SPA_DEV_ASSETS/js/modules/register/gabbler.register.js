/**
 * Created by Antonin on 26/01/2015.
 */
angular.module('gabbler.register', [


])


.controller('registerCtrl', ['$scope', '$rootScope', '$location', 'RegisterService', 'AuthenticationService',
    function($scope,$rootScope,$location, RegisterService, AuthenticationService) {
        //RegisterService.ClearCredentials();

        $scope.register = function () {
            console.log("entree fct register");
            $scope.dataLoading = true;

            $scope.error = $scope.gender + $scope.lastname + $scope.firstname + new Date($scope.birthdate) + $scope.email + $scope.username + $scope.pwd;
            RegisterService.Register($scope.gender,$scope.lastname, $scope.firstname,$scope.birthdate,$scope.email, $scope.username, $scope.pwd, function (response) {
                if (response.success) {
                    console.log("succes register");
                   // AuthenticationService.Login($scope.username,$scope.pwd);
                    //AuthenticationService.SetCredentials($scope.username, $scope.pwd);
                   // $location.path('/timeline');
                } else {
                    console.log("Erreur");
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            });
        };


    }])
    .directive('register',function() {
        return {
            restrict: 'E',
            /* scope: true,
             replace: true,*/
            templateUrl: '/main/webapp/app/js/modules/register/register.html'
        };
    });
