/**
 * Created by Antonin on 09/02/2015.
 */

angular.module('gabbler.register.service', [])

    .factory('RegisterService',
    ['$http', '$cookieStore', '$rootScope', '$timeout',
        function ( $http, $cookieStore, $rootScope, $timeout) {
            var service = {};

            service.Register = function (lastname,firstname,username, pwd, callback) {
                console.log("entree service register");
                /* Dummy authentication for testing, uses $timeout to simulate api call
                 ----------------------------------------------*/
               $timeout(function(){

                   if (lastname !== '' && firstname !== '' && username !== '' && pwd !== '') {
                       console.log("condition service");
                       var response = {success: 'true'};
                       if (response.success === 'true') {
                           response.message = 'One field is incorrect';
                           console.log("Erreur success api");
                       }
                       callback(response);
                   }
                }, 1000);


                /* Use this for real authentication
                 ----------------------------------------------*/
                //$http.post('/api/authenticate', { username: username, password: password })
                //    .success(function (response) {
                //        callback(response);
                //    });

            };

            return service;
        }]);