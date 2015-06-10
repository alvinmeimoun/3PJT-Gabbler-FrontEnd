/**
 * Created by Antonin on 09/02/2015.
 */

angular.module('gabbler.register.service', [
    'gabbler.server.service'
])

    .factory('RegisterService',
    ['$http', '$cookieStore', '$rootScope', '$timeout', 'ServerLink',
        function ( $http, $cookieStore, $rootScope, $timeout , ServerLink) {
            var service = {};

            // Méthode permettant l'enregistrement d'un utilisateur
            service.Register = function (gender,lastname,firstname,birthdate,email,username, pwd, callback) {
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
                var url = ServerLink.GetBaseUrlFromServer() + '/user/subscribe';

                $http.defaults.headers.post = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': '*', 'sessionAuthToken': token};
                   $http.post(url, requestData )
                       .success(function (response,status)
                       {
                           callback(response,status);
                       })
                       .error(function (response,status)
                       {
                           callback(response,status);

                       });
            };

            return service;
        }]);