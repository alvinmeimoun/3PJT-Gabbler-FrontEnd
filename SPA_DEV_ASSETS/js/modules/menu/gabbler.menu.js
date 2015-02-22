/**
 * Created by Antonin on 26/01/2015.
 */
angular.module('gabbler.menu', [

])

.directive('menu',function() {
    return {
        restrict: 'E',
        scope: true,
        replace: true,
        templateUrl: '/main/webapp/app/js/modules/menu/menu.html'
    };
})

.controller('menuCtrl', function($scope,$cookieStore, $location, AuthenticationService) {

        /*$scope.message = "Waiting 2000ms for update";*/

            setInterval(function () {
                $scope.$apply(function () {
                    var credentials = AuthenticationService.GetCredentials();
                    if (typeof(credentials.currentUser) === 'undefined')
                    {

                        $scope.nickname = "";
                    }
                    else /*if (credentials.currentUser)*/{
                        $scope.nickname = credentials.currentUser.username;
                    }

                });
            }, 2000);



       /* setTimeout(function(){

            $scope.$apply(function()
            {
                if ($cookieStore.get("globals")) {
                    $scope.nickname = $cookieStore.get("globals").currentUser.username;

                }
                else {
                    $scope.nickname = "";
                }

            }, 2000);

        });*/



        $scope.logout = function()
        {
            AuthenticationService.Logout(function (response)
            {
                alert("Vous avez été deco" + response.status);
            });
        };
    });