angular.module('gabbler.profile.service', [


    ])

    .factory('ProfileService',
    ['$http', '$cookieStore', '$rootScope', '$timeout',
        function ( $http, $cookieStore, $rootScope, $timeout) {
            var service = {};

            service.GetUserDatas = function(id,callback)
            {
                    var token = $cookieStore.get("globals").currentUser.token;
                    //AuthenticationService.GetCredentials().currentUser.token;
                    $http.defaults.headers.get = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': '*', 'sessionAuthToken': token};
                   // var headers = { 'sessionAuthToken': '4733c400ae6cf9db51db171ae9587097e15609129273abda7b51a89e1a83b8f3' };
                    //console.log("http request");

                    if( id === "0") {
                        $http.get("http://localhost:8082/gabbler/api/user/get?userId=" + "2")
                            .success(function (response, status) {
                                callback(response, status);
                            })
                            .error(function (response, status) {
                                callback(response, status);

                            });
                    }
            };

            service.UpdateUserDatas = function(id,firstname,lastname,nickname,email,birthdate,callback)
            {
              var token = $cookieStore.get("globals").currentUser.token;
                var gettingId;
                var lastModification = new Date();
                var date = new Date(birthdate);
                if (id === "0")
                {
                    gettingId = 2;
                }
                var requestData =
                {
                    "id": "2",
                    "displayName": "Utilisateur de test",
                    "email": email,
                    "nickname": nickname,
                    "birthdate": date,
                    "firstname": firstname,
                    "lastname": lastname,
                    "creationDate": lastModification
                };
                $http.defaults.headers.post = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': 'Raw', 'sessionAuthToken': token};

                $http.post("http://localhost:8082/gabbler/api/user/update",requestData)
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