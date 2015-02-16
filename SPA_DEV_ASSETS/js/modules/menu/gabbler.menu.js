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

.controller('menuCtrl', function($scope,$cookieStore, $location, AuthenticationService){

        if($cookieStore.get("globals"))
        {
            $scope.nickname = $cookieStore.get("globals").currentUser.username;

        }
        else
        {
            $scope.nickname = "";
        }

        $scope.$watch(function($scope) {
            //update the DOM with newValu
            console.log( "Function watched" );
            return $scope.nickname; },
            function(newValue) {
             //   $scope.nickname = $cookieStore.get("globals").currentUser.username;

               console.log( "Function new value" + newValue );
            }
        );


        $scope.logout = function()
        {
            AuthenticationService.Logout(function (response)
            {
                alert("Vous avez été deco" + response.status);
            });
        };
    });