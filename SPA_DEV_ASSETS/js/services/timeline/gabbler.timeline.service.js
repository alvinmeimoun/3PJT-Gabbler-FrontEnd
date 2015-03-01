/**
 * Created by Antonin on 21/02/2015.
 */
angular.module('gabbler.timeline.service', [

])



.factory('TimelineServices',  ['$http', '$cookieStore', '$rootScope', '$timeout',
        function ( $http, $cookieStore, AuthenticationService, $rootScope, $timeout) {
            var service = {};


            service.GetProfilePreview = function(id,callback)
            {

               var token = $cookieStore.get("globals").currentUser.token;
                   //AuthenticationService.GetCredentials().currentUser.token;
                $http.defaults.headers.get = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': '*', 'sessionAuthToken': token};
                var headers = { 'sessionAuthToken': '4733c400ae6cf9db51db171ae9587097e15609129273abda7b51a89e1a83b8f3' };

                console.log("http request");
                var loginResponse ;
                if( id === "0") {
                    $http.get("http://localhost:8082/gabbler/api/user/get?userId=" + "2")
                        .success(function (response, status) {
                            callback(response, status);
                        })
                        .error(function (response, status) {
                            callback(response, status);

                        });
                }
                else if(id !== "0")
                {
                    $http.get("http://localhost:8082/gabbler/api/user/get?userId=" + id )
                        .success(function (response, status) {
                            callback(response, status);
                        })
                        .error(function (response, status) {
                            callback(response, status);

                        });
                }
            };
            service.AddAGab = function(gab,callback)
            {
                var date =  new Date();
                var token = $cookieStore.get("globals").currentUser.token;
                var requestData = {

                    "content": gab,
                    "userId": 2,
                    "postDate": date
                };
                $http.defaults.headers.post = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': 'Raw', 'sessionAuthToken': token};
                $http.post("http://localhost:8082/gabbler/api/gabs/publish",requestData)
                    .success(function(response,status)
                {
                    callback(response,status);
                })
                    .error(function(response,status)
                    {
                        callback(response,status);
                    });

            };

            service.GetMyGabs = function(callback)
            {
                var token = $cookieStore.get("globals").currentUser.token;
                //AuthenticationService.GetCredentials().currentUser.token;
                $http.defaults.headers.get = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': '*', 'sessionAuthToken': token};
                $http.get("http://localhost:8082/gabbler/api/gabs/timeline/user?userId=" + "2" + "&startIndex=0&count=20" )
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