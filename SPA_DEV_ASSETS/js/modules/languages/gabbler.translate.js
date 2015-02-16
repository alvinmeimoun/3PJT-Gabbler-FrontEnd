/**
 * Created by Antonin on 18/01/2015.
 */
angular.module('gabbler.translate', [
    'pascalprecht.translate',
    'ngCookies'
])

    .config(function($translateProvider){
        $translateProvider.useStaticFilesLoader({
            prefix: '/main/webapp/app/js/modules/languages/',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('en');
    })
    .controller('MainCtrl', function ($scope, $translate) {
        $scope.changeLanguage = function (key) {
            $translate.use(key);
        };
    });