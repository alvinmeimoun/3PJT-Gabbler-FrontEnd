/**
 * Created by Antonin on 21/02/2015.
 */
var urlServer = 'http://localhost:8082/gabbler/api';

angular.module('gabbler.timeline.service', [
    'toastr',
    'gabbler.server.service',
    'gabbler.login.service'
])



.factory('TimelineServices',  ['$http', '$cookieStore', '$rootScope', '$timeout', 'ServerLink', 'toastr',
        function ( $http, $cookieStore, AuthenticationService, $rootScope, $timeout, ServerLink, toastr) {
            var service = {};
            var token;
            var userID;
            // On récupère l'utilisateur en ligne
            token = $cookieStore.get("globals").currentUser.token;
            userID = $cookieStore.get("globals").currentUser.userID;

            // Méthode permettant de récupérer les données du profil utilisateur pour un affichage minimal
            service.GetProfilePreview = function(optionalVisitedUserId,callback) {
                //var test = urlServer;
                //toastr.info('test' , test );
                //toastr.info("service :" , optionalVisitedUserId);
                if (optionalVisitedUserId !== 0){

                    userID = optionalVisitedUserId;
                }
                else
                {
                    userID = $cookieStore.get("globals").currentUser.userID;
                }
                $http.defaults.headers.get = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': '*', 'sessionAuthToken': token};
                var url = urlServer + '/user/get?userId=';
                if(userID) {
                    $http.get( url + userID)
                        .success(function (response, status) {
                            callback(response, status);
                        })
                        .error(function (response, status) {
                            callback(response, status);

                        });
                }
            };

            // Méthode permettant d'ajouter un gab
            service.AddAGab = function(gab,callback) {
                var date =  new Date();
                token = $cookieStore.get("globals").currentUser.token;
                userID = $cookieStore.get("globals").currentUser.userID;
                var requestData = {

                    "content": gab,
                    "userId": userID,
                    "postDate": date
                };
                $http.defaults.headers.post = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': 'Raw', 'sessionAuthToken': token};
                var url = urlServer + '/gabs/publish';
                $http.post(url,requestData)
                    .success(function(response,status)
                {
                    callback(response,status);
                })
                    .error(function(response,status)
                    {
                        callback(response,status);
                    });

            };

            // Méthode permettant de supprimer un gab
            service.DeleteGab = function(gabId,callback) {
                token = $cookieStore.get("globals").currentUser.token;
                $http.defaults.headers.delete = {'sessionAuthToken': token};
                var url = urlServer + '/gabs/delete?gabsId=';

                $http.delete(url + gabId)
                    .success(function(response,status)
                    {
                        callback(response,status);
                    })
                    .error(function(response,status)
                    {
                        callback(response,status);
                    });

            };

            // Méthode permettant de récupérer les gabs d'un utilisateur
            service.GetMyGabs = function(optionalVisitedUserId,callback) {
                var token = $cookieStore.get("globals").currentUser.token;
                var userID = 0;
                if (optionalVisitedUserId !== 0)
                {
                    userID = optionalVisitedUserId;
                }
                else
                {
                    userID = $cookieStore.get("globals").currentUser.userID;
                }

                var url = urlServer + '/gabs/timeline/user?userId=';
                $http.defaults.headers.get = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': '*', 'sessionAuthToken': token};

                $http.get(url + userID + "&startIndex=0&count=20" )
                    .success(function (response,status)
                    {
                        var formattedresponse = service.AddDatasToGabs(response);
                        var formattedresponseWithLikers = service.AddLikersSentence(formattedresponse);

                        callback(formattedresponseWithLikers,status);
                    })
                    .error(function (response,status)
                    {
                        callback(response,status);

                    });
            };

            // Méthode permettant de récupérer la timeline global
            service.GetGabsTimelineGlobal = function(callback) {
                $http.defaults.headers.get = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': '*', 'sessionAuthToken': token};
                var url = urlServer + '/gabs/timeline?startIndex=0&count=20';
                $http.get(url)
                    .success(function(response, status)
                    {
                       var formattedresponse = service.AddDatasToGabs(response);
                        var formattedresponseWithLikers = service.AddLikersSentence(formattedresponse);
                        callback(formattedresponseWithLikers,status);
                    })
                    .error(function(response, status)
                    {
                        callback(response,status);
                    });

            };

            // Méthode permettant d'ajouter des données au gab pour l'affichage
            service.AddDatasToGabs = function(response) {
                var states = ['Like', 'Unlike'];
                var formattedresponse = response;

                for (var i in formattedresponse) {
                    if (formattedresponse.hasOwnProperty(i)) {
                        // Permet de générer la miniature et le bouton like ou dislike
                        var url = urlServer + '/user/picture/profile?userID=';
                        formattedresponse[i].pictureProfile = url + formattedresponse[i].userId;
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


            // Méthode permettant de gérer la liste des like
            service.AddLikersSentence = function(response){
                var likers = "";
                var userID = $cookieStore.get("globals").currentUser.userID;
                response.forEach(function(item){

                    if(item.likers.length > 0)
                    {
                        item.likers.forEach(function(liker)
                        {
                            if(liker.userID !== userID)
                            {
                                if(likers.length > 1)
                                {
                                    likers += liker.displayName + ', ';
                                }
                                else
                                {
                                    likers = liker.displayName;
                                }
                            }
                            else
                            {
                                likers += " You ";
                            }
                        });
                        item.formattedLikers = likers;
                        item.isLiked = true;
                        likers = "";

                    }
                    else{
                        item.isLiked = false;
                    }

                });
                return response;
            };

            // Méthode permettant l'ajout de photo de profil
            service.uploadFileToUrl = function(file,callback){
                token = $cookieStore.get("globals").currentUser.token;

                $http.defaults.headers.post = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': '*', 'sessionAuthToken': token};
                var url = urlServer + '/user/picture/profile';

                var image = new FormData();
                image.append('image', file);
                $http.post(url, image, {
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
            // Méthode permettant de mettre à jour la photo de profil
            service.setProfilePicture = function() {
                var timestamp;

                timestamp =  new Date().getTime();
                var url = urlServer + '/user/picture/profile?userID=';
                profilePicture =   urlServer + '/user/picture/profile?userID=' + userID + '&timestamp=' + timestamp;

                return profilePicture;
            };

            // Méthode permettant l'upload de la photo de couverture
            service.uploadPictureBackground = function(file,callback){
                token = $cookieStore.get("globals").currentUser.token;
                //AuthenticationService.GetCredentials().currentUser.token;
                $http.defaults.headers.post = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': '*', 'sessionAuthToken': token};
                var url = urlServer + '/user/picture/profile/background';

                var image = new FormData();
                image.append('image', file);
                $http.post(url, image, {
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

            // Méthode permettant la mise à jour de la photo de couverture
            service.setBackgroundPicture = function() {
                //userID = $cookieStore.get("globals").currentUser.userID;
               var timestamp =  new Date().getTime();
                if (optionalVisitedUserId !== 0)
                {
                    userID = optionalVisitedUserId;
                }
                else
                {
                    userID = $cookieStore.get("globals").currentUser.userID;
                }
                profilePicture = urlServer + '/user/picture/profile/background?userID='  + userID + '&timestamp=' + timestamp;
                return profilePicture;
            };

            // Méthode permettant la recherche utilisateur
            service.SearchUser = function(search, callback) {

                $http.defaults.headers.get = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': '*', 'sessionAuthToken': token};
                var url = urlServer + '/user/search?req=';
                if (search !== "")
                {
                    $http.get(url + search)
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
            service.FollowUser = function(followedUserId,callback) {
                $http.defaults.headers.put = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': '*', 'sessionAuthToken': token};
                var url = urlServer + '/user/follow?userId=';
                $http.put(url + followedUserId)
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
            service.UnFollowUser = function(followedUserId,callback) {
                $http.defaults.headers.put = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': '*', 'sessionAuthToken': token};
                var url = urlServer + '/user/unfollow?userId=';
                $http.put(url + followedUserId)
                    .success(function(response,status)
                    {
                        callback(response,status);
                    })
                    .error(function(response, status)
                    {
                        callback(response,status);
                    });
            };

            // service permettant de Like un gab
            service.LikeGab = function(gabId, callback) {
                $http.defaults.headers.put = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': '*', 'sessionAuthToken': token};
                var url = urlServer + '/gabs/like?gabsId=';
                $http.put(url + gabId)
                    .success(function(response,status)
                    {
                        callback(response,status);
                    })
                    .error(function(response, status)
                    {
                        callback(response,status);
                    });
            };

            // service permettant de dislike un gab
            service.DislikeGab = function(gabId, callback)  {
                var url = urlServer + '/gabs/unlike?gabsId=';
                $http.defaults.headers.put = {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' , 'Access-Control-Allow-Headers': '*', 'sessionAuthToken': token};

                $http.put(url + gabId)
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