/**
 * Created by Antonin on 21/02/2015.
 */
angular.module('gabbler.timeline.service', [

])



.factory('TimelineServices',  ['$http', '$cookieStore', '$rootScope', '$timeout',
        function ( $http, $cookieStore, AuthenticationService, $rootScope, $timeout) {
            var service = {};
            var token;
            var userID;
            token = $cookieStore.get("globals").currentUser.token;
            userID = $cookieStore.get("globals").currentUser.userID;

            service.GetProfilePreview = function(callback)
            {

                //AuthenticationService.GetCredentials().currentUser.token;
                $http.defaults.headers.get = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': '*', 'sessionAuthToken': token};
               // var headers = { 'sessionAuthToken': '4733c400ae6cf9db51db171ae9587097e15609129273abda7b51a89e1a83b8f3' };

                console.log("http request");
                var loginResponse ;
                if(userID) {
                    $http.get("http://localhost:8082/gabbler/api/user/get?userId=" + userID)
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
                token = $cookieStore.get("globals").currentUser.token;
                userID = $cookieStore.get("globals").currentUser.userID;
                var requestData = {

                    "content": gab,
                    "userId": userID,
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
            service.DeleteGab = function(gabId,callback)
            {
                var date =  new Date();
                token = $cookieStore.get("globals").currentUser.token;
                //userID = $cookieStore.get("globals").currentUser.userID;

                $http.defaults.headers.delete = {'sessionAuthToken': token};
                $http.delete("http://localhost:8082/gabbler/api/gabs/delete?gabsId=" + gabId)
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
                var userID = $cookieStore.get("globals").currentUser.userID;
                //AuthenticationService.GetCredentials().currentUser.token;
                $http.defaults.headers.get = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': '*', 'sessionAuthToken': token};
                $http.get("http://localhost:8082/gabbler/api/gabs/timeline/user?userId=" + userID + "&startIndex=0&count=20" )
                    .success(function (response,status)
                    {
                        var formattedresponse = service.AddDatasToGabs(response);
                        callback(formattedresponse,status);
                    })
                    .error(function (response,status)
                    {
                        callback(response,status);

                    });
            };
            service.GetGabsTimelineGlobal = function(callback)
            {
                $http.defaults.headers.get = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': '*', 'sessionAuthToken': token};
                $http.get("http://localhost:8082/gabbler/api/gabs/timeline?startIndex=0&count=20")
                    .success(function(response, status)
                    {
                       var formattedresponse = service.AddDatasToGabs(response);
                        callback(formattedresponse,status);
                    })
                    .error(function(response, status)
                    {
                        callback(response,status);
                    });

            };

            service.AddDatasToGabs = function(response)
            {
                var states = ['Like', 'Unlike'];
                var formattedresponse = response;

                for (var i in formattedresponse) {
                    if (formattedresponse.hasOwnProperty(i)) {
                        // Permet de générer la miniature et le bouton like ou dislike
                        formattedresponse[i].pictureProfile = 'http://localhost:8082/gabbler/api/user/picture/profile?userID=' + formattedresponse[i].userId;
                        var likers = formattedresponse[i].likers;
                        if (likers.length !== 0 )
                        {
                            for(var j in likers)
                            {
                                if (likers.hasOwnProperty(j))
                                {
                                    if (likers[j].userID == userID)
                                    {
                                        formattedresponse[i].btnLike = {
                                            state: states[1],
                                            index: i
                                        };
                                    }
                                    else
                                    {
                                        formattedresponse[i].btnLike = {
                                            state: states[0],
                                            index: i
                                        };
                                    }
                                }
                            }
                        }
                        else
                        {
                            formattedresponse[i].btnLike = {
                                state: states[0],
                                index: i
                            };
                        }

                    }

                }
                return formattedresponse;
            };
            service.uploadFileToUrl = function(file,callback){
                token = $cookieStore.get("globals").currentUser.token;
                //AuthenticationService.GetCredentials().currentUser.token;
                $http.defaults.headers.post = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': '*', 'sessionAuthToken': token};
                var uploadUrl = "http://localhost:8082/gabbler/api/user/picture/profile";
                var image = new FormData();
                image.append('image', file);
                $http.post(uploadUrl, image, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                    .success(function(response, status){
                        callback(response,status);
                    })
                    .error(function(response, status){
                        callback(response,status);
                    });
            };

            var profilePicture =  {};

            service.setProfilePicture = function()
            {
                var timestamp;

                timestamp =  new Date().getTime();
                profilePicture =  'http://localhost:8082/gabbler/api/user/picture/profile?userID=' + userID + '&timestamp=' + timestamp;

                return profilePicture;
            };

            service.uploadPictureBackground = function(file,callback){
                token = $cookieStore.get("globals").currentUser.token;
                //AuthenticationService.GetCredentials().currentUser.token;
                $http.defaults.headers.post = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': '*', 'sessionAuthToken': token};
                var uploadUrl = "http://localhost:8082/gabbler/api/user/picture/profile/background";
                var image = new FormData();
                image.append('image', file);
                $http.post(uploadUrl, image, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                    .success(function(response, status){
                        callback(response,status);
                    })
                    .error(function(response, status){
                        callback(response,status);
                    });
            };
            service.setBackgroundPicture = function()
            {
                userID = $cookieStore.get("globals").currentUser.userID;
                var timestamp =  new Date().getTime();
                profilePicture =  'http://localhost:8082/gabbler/api/user/picture/profile/background?userID=' + userID + '&timestamp=' + timestamp;
                return profilePicture;
            };


            service.SearchUser = function(search, callback) {

                $http.defaults.headers.get = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': '*', 'sessionAuthToken': token};
                if (search !== "")
                {
                    $http.get("http://localhost:8082/gabbler/api/user/search?req=" + search)
                        .success(function(response,status)
                        {
                            callback(response,status);
                        })
                        .error(function(response, status)
                        {
                            callback(response,status);
                        });
                }

            };

            // service permettant de Follow un user
            service.FollowUser = function(followedUserId,callback)
            {
                $http.defaults.headers.put = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': '*', 'sessionAuthToken': token};

                $http.put("http://localhost:8082/gabbler/api/user/follow?userId=" + followedUserId)
                    .success(function(response,status)
                    {
                        callback(response,status);
                    })
                    .error(function(response, status)
                    {
                        callback(response,status);
                    });
            };
            // service permettant de Follow un user
            service.UnFollowUser = function(followedUserId,callback)
            {
                $http.defaults.headers.put = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': '*', 'sessionAuthToken': token};

                $http.put("http://localhost:8082/gabbler/api/user/unfollow?userId=" + followedUserId)
                    .success(function(response,status)
                    {
                        callback(response,status);
                    })
                    .error(function(response, status)
                    {
                        callback(response,status);
                    });
            };

            service.LikeGab = function(gabId, callback)
            {
                $http.defaults.headers.put = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': '*', 'sessionAuthToken': token};

                $http.put("http://localhost:8082/gabbler/api/gabs/like?gabsId=" + gabId)
                    .success(function(response,status)
                    {
                        callback(response,status);
                    })
                    .error(function(response, status)
                    {
                        callback(response,status);
                    });
            };

            service.DislikeGab = function(gabId, callback)
            {
                $http.defaults.headers.put = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': '*', 'sessionAuthToken': token};

                $http.put("http://localhost:8082/gabbler/api/gabs/unlike?gabsId=" + gabId)
                    .success(function(response,status)
                    {
                        callback(response,status);
                    })
                    .error(function(response, status)
                    {
                        callback(response,status);
                    });
            };
            return service;
        }]);