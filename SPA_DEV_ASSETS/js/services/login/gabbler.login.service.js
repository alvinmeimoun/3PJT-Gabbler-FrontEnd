/**
 * Created by Antonin on 27/01/2015.
 */
angular.module('gabbler.login.service', [

])

    .factory('AuthenticationService',
    ['Base64', '$http', '$cookieStore', '$rootScope', '$timeout',
        function (Base64, $http, $cookieStore, $rootScope, $timeout) {
            var service = {};

            service.Login = function (username, pwd, callback) {

                /* Dummy authentication for testing, uses $timeout to simulate api call
                 ----------------------------------------------*/
                /*$timeout(function(){

                    var response = { success: username === 'test' && pwd === 'test' };
                    if(!response.success) {
                        response.message = 'Username or password is incorrect';
                        console.log("Erreur success api");
                    }
                    callback(response);
                }, 1000);*/


                /* Use this for real authentication
                 ----------------------------------------------*/
                var requestData = { "password": pwd,"username": username };

                    console.log("http request");
                    var loginResponse ;
                    $http.post("http://localhost:8082/gabbler/api/login", requestData )
                    .success(function (response,status)
                    {
                        callback(response,status);
                    })
                    .error(function (response,status)
                    {
                        callback(response,status);

                    });
            };
            service.Logout = function (callback) {
                var requestData = {"token" : $cookieStore.get("globals").currentUser.token };
                var headers = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                $http.get("http://localhost:8082/gabbler/api/logout", headers, requestData )
                    .success(function (response,status)
                    {
                        callback(response,status);
                    })
                    .error(function (response,status)
                    {
                        callback(response,status);

                    });

            };
           service.SetCredentials = function (username, token) {
               // var authdata = Base64.encode(username + ':' + pwd);
                $rootScope.globals = {
                    currentUser: {
                        username: username,
                        token: token
                    }
                };
               $http.defaults.headers.common['Authorization'] = 'Basic ' + token; // jshint ignore:line
               $cookieStore.put('globals', $rootScope.globals);
            };
            service.GetCredentials = function()
            {
                return $cookieStore.get("globals");
            };

            service.ClearCredentials = function () {
                $rootScope.globals = {};
                $cookieStore.remove('globals');
                $cookieStore.remove('UserToken');
                $http.defaults.headers.common.Authorization = 'Basic ';
            };

            return service;
        }])


    .factory('Base64', function () {
        /* jshint ignore:start */

        var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

        return {
            encode: function (input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                do {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";
                } while (i < input.length);

                return output;
            },

            decode: function (input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
                var base64test = /[^A-Za-z0-9\+\/\=]/g;
                if (base64test.exec(input)) {
                    window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
                }
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                do {
                    enc1 = keyStr.indexOf(input.charAt(i++));
                    enc2 = keyStr.indexOf(input.charAt(i++));
                    enc3 = keyStr.indexOf(input.charAt(i++));
                    enc4 = keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";

                } while (i < input.length);

                return output;
            }
        };

        /* jshint ignore:end */
    });

