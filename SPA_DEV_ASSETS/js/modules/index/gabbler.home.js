/**
 * Created by Antonin on 26/01/2015.
 */
angular.module('gabbler.home', [


    'gabbler.menu',
    'gabbler.login',
    'gabbler.register'

])

    .controller('indexCtrl', function($scope, AuthenticationService) {
        $scope.pageClass = 'indexPageClass';
        AuthenticationService.ClearCredentials();
    });