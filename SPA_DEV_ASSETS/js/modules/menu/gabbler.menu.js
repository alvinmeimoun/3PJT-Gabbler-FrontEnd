/**
 * Created by Antonin on 26/01/2015.
 */
angular.module('gabbler.menu', [
'toastr'
])

.directive('menu',function() {
    return {
        restrict: 'E',
        //scope: true,
        replace: true,
        templateUrl: '/main/webapp/app/js/modules/menu/menu.html'
    };
})

.controller('menuCtrl', function($scope,$cookieStore, $location, AuthenticationService,toastr) {

        /*$scope.message = "Waiting 2000ms for update";*/
        var credentials = AuthenticationService.GetCredentials();
        if (typeof credentials === 'undefined' )
        {
            $scope.nickname = "";
            $scope.disable = true;
        }
        else {
            $scope.disable = false;
            $scope.nickname = credentials.currentUser.username;

        }
            setInterval(function () {
               $scope.$apply(function () {
                    var credentials = AuthenticationService.GetCredentials();
                    if (typeof credentials === 'undefined' )
                    {
                        $scope.nickname = "";
                        $scope.disable = true;

                    }
                    else /*if (credentials.currentUser)*/{
                        $scope.nickname = credentials.currentUser.username;
                        $scope.disable = false;
                    }

               });
            }, 2000);

        $scope.logout = function()
        {
            AuthenticationService.Logout(function (response)
            {

            });
        };
        /*$scope.goToEditProfile = function ()
        {
            $location.path('/profile');
        }*/
    });