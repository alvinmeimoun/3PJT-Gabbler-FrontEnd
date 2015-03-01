/**
 * Created by Antonin on 09/02/2015.
 */

angular.module('gabbler.register.service', [])

    .factory('RegisterService',
    ['$http', '$cookieStore', '$rootScope', '$timeout',
        function ( $http, $cookieStore, $rootScope, $timeout) {
            var service = {};

            service.Register = function (gender,lastname,firstname,birthdate,email,username, pwd, callback) {
                console.log("entree service register");
                /* Dummy authentication for testing, uses $timeout to simulate api call
                ----------------------------------------------*/
                var bDate = new Date(birthdate);
                var date = new Date();
                var requestData =
                {

                    "password": pwd,
                    "displayName": username,
                    "nickname": username,
                    "birthdate": bDate,
                    "firstname": firstname,
                    "lastname": lastname,
                    "email": email ,
                    "gender": gender,
                    "creationDate": date

                };


                   $http.post("http://localhost:8082/gabbler/api/user/subscribe", requestData )
                       .success(function (response,status)
                       {
                           callback(response,status);
                       })
                       .error(function (response,status)
                       {
                           callback(response,status);

                       });

                  /* if (lastname !== '' && firstname !== '' && username !== '' && pwd !== '') {
                       console.log("condition service");
                       var response = {success: 'true'};
                       if (response.success === 'true') {
                           response.message = 'One field is incorrect';
                           console.log("Erreur success api");
                       }
                       callback(response);
                   }*/


                /* Use this for real authentication
                 ----------------------------------------------*/
                //$http.post('/api/authenticate', { username: username, password: password })
                //    .success(function (response) {
                //        callback(response);
                //    });

            };

            return service;
        }]);