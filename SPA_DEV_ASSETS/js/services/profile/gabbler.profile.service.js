/**
 * Created by Antonin on 11/02/2015.
 * Service permettant l'affichage et la modification des informations de l'utilisateur
 *
 */

angular.module('gabbler.profile.service', [
    'gabbler.server.service'

    ])

    .factory('ProfileService',
    ['$http', '$cookieStore', '$rootScope', '$timeout', 'ServerLink',
        function ( $http, $cookieStore, $rootScope, $timeout , ServerLink) {
            var service = {};
            var token;
            var userID;
            // Méthode permettant de récupérer les données du profil utilisateur
            service.GetUserDatas = function(callback) {
                    token = $cookieStore.get("globals").currentUser.token;
                    userID = $cookieStore.get("globals").currentUser.userID;
                    //AuthenticationService.GetCredentials().currentUser.token;
                    $http.defaults.headers.get = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': '*', 'sessionAuthToken': token};
                    if( userID !== "0") {
                        var url = ServerLink.GetBaseUrlFromServer() + '/user/get?userId=';
                        $http.get(url + userID)
                            .success(function (response, status) {
                                callback(response, status);
                            })
                            .error(function (response, status) {
                                callback(response, status);

                            });
                    }
            };

            // Méthode permettant de mettre à jour les données du profil utilisateur
            service.UpdateUserDatas = function(firstname,lastname,nickname,displayname,email,birthdate,callback) {
                token = $cookieStore.get("globals").currentUser.token;
                userID = $cookieStore.get("globals").currentUser.userID;
                var lastModification = new Date();
                var date = new Date(birthdate);

                var requestData =
                {
                    "id": userID,
                    "email": email,
                    "nickname": nickname,
                    "birthdate": date,
                    "displayName": displayname,
                    "firstname": firstname,
                    "lastname": lastname,
                    "creationDate": lastModification
                };
                $http.defaults.headers.post = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': 'Raw', 'sessionAuthToken': token};
                var url = ServerLink.GetBaseUrlFromServer() + '/user/update';
                $http.post(url,requestData)
                    .success(function (response,status)
                    {
                        callback(response,status);
                    })
                    .error(function (response,status)
                    {
                        callback(response,status);

                    });


            };

            // Méthode permettant de mettre à jour le mot de passe utilisateur
            service.UpdatePassword = function(oldPassword,newPassword, callback) {
                token = $cookieStore.get("globals").currentUser.token;
                var requestData =
                {
                    "oldPassword" : oldPassword,
                    "newPassword" : newPassword
                };
                $http.defaults.headers.post = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': 'Raw', 'sessionAuthToken': token};
                var url = ServerLink.GetBaseUrlFromServer() + '/user/password_change';
                $http.post(url,requestData)
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
        }

        ]);