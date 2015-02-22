/**
 * Created by Antonin on 26/01/2015.
 */

var gabblerApp = angular.module('gabblerApp', [
    'ngRoute',
    'ngAnimate',
    'gabbler.translate',
    'gabbler.login.service',
    'gabbler.menu',
    'gabbler.login',
    'gabbler.register',
    'gabbler.home',
    'gabbler.timeline'


]);
gabblerApp.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/', {
                    templateUrl: '/main/webapp/app/js/modules/index/home.html',
                    controller: 'indexCtrl'

                });
            $routeProvider.
                when('/timeline', {
                    templateUrl: '/main/webapp/app/js/modules/timeline/timeline.html'
                    // controller: 'Ctrl'

                });

        }])
    .run(function($http) {
        $http.defaults.headers.post = {'Content-Type': 'application/json' , 'Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': 'x-requested-with'};
        //$http.defaults.headers.get = {'Content-Type': 'application/json' , 'Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': 'x-requested-with'};
    });
/*.run(function(authService, $location, $rootScope, $state){

    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
        if (!_.isEmpty(toState.hasRoles)){
            authService.hasRoles(toState.hasRoles).then(function(result){
                if(!result){
                    $state.transitionTo("login");
                    event.preventDefault();
                }
            },function(){});
        }
        if (!_.isEmpty(toState.hasNotRoles)){
            authService.hasRoles(toState.hasNotRoles).then(function(result){
                if(result){
                    $state.transitionTo("index");
                    event.preventDefault();
                }
            },function(){});
        }
    });

});*/