/**
 * Created by Antonin on 26/01/2015.
 */
angular.module('gabbler.register', [

    'toastr'

])


.controller('registerCtrl', ['$scope', '$rootScope', '$location', 'RegisterService', 'AuthenticationService','toastr',
    function($scope,$rootScope,$location, RegisterService, AuthenticationService,toastr) {
        //RegisterService.ClearCredentials();

        $scope.register = function () {
            //console.log("entree fct register");
            $scope.dataLoading = true;

           // $scope.error = $scope.gender + $scope.lastname + $scope.firstname + new Date($scope.birthdate) + $scope.email + $scope.username + $scope.pwd;
            RegisterService.Register($scope.gender,$scope.lastname, $scope.firstname,$scope.birthdate,$scope.email, $scope.username, $scope.pwd, function (response) {
               // si le register est un succès on redirige vers la timeline utilisateur
                if (response){
                   AuthenticationService.Login($scope.username,$scope.pwd, function(response)
                   {
                       if (response)
                       {
                           toastr.info('Welcome To Gabbler !', 'Just Gab with your friends!');
                           $location.path('/timeline/user');
                       }
                       else
                       {
                           toastr.error("Error while register, please retry again");
                       }
                   });
                } else {
                   // console.log("Erreur");
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
