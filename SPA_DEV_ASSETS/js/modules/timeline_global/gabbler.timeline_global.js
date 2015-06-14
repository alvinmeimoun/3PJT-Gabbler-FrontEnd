/**
 * Created by Antonin on 11/02/2015.
 */

angular.module('gabbler.timeline.global' , [

    'gabbler.timeline.service', 'toastr' , 'ui.bootstrap', 'gabbler.server.service'


])

    .directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }])
// Controller gérant la partie profil de l'utilisateur
    .controller('profileOverviewGlobalCtrl', ['$scope', '$cookieStore', '$location', 'AuthenticationService', 'TimelineServices', 'toastr', '$rootScope', '$timeout', '$route',
        function($scope,$cookieStore,$location,AuthenticationService,TimelineServices,toastr, $rootScope, $timeout, $route){

            if(typeof($cookieStore.get("globals")) !== "undefined") {
                var user = null;
                $scope.token = $cookieStore.get("globals").currentUser.token;
                var userID = $cookieStore.get("globals").currentUser.userID;

            }

            TimelineServices.GetMyGabs(0,function(response) {

                $scope.countGabs = response.length;
            });
            $scope.updated = 0;
            setInterval(function () {
                $scope.$apply(function () {
                    TimelineServices.GetMyGabs(0,function(response) {

                        $scope.countGabs = response.length;
                    });
                });
            }, 10000);
            TimelineServices.GetProfilePreview(0,function(response)
            {
                if (response) {
                    user = response;
                    $scope.user = response;
                    $scope.profilePicture = TimelineServices.setProfilePicture();
                    $scope.coverPicture = TimelineServices.setBackgroundPicture(0);
                } else {
                    console.log("Erreur");

                }
            });


        }])


    .controller('timelineGlobalCtrl', function($scope,$cookieStore, $location,TimelineServices,toastr, $rootScope, AuthenticationService){

        var gabs = [];
        $scope.states = ['Like', 'Unlike'];

        TimelineServices.GetGabsTimelineGlobal(function(response) {

            $scope.gabs = response;

        });
        // Permet de mettre à jour la timeline toute les 30 secondes pour permettre à l'utilisateur d'avoir
        // une timeline à jour
        setInterval(function () {
            $scope.$apply(function () {
                TimelineServices.GetGabsTimelineGlobal(function(response) {
                    $scope.gabs = response;
                });

            });
        },10000);
        $scope.addGab = function ()
        {
            TimelineServices.AddAGab($scope.gab,function(response)
            {
                if(response.id)
                {
                    $scope.gab = '';
                    TimelineServices.GetGabsTimelineGlobal(function(response) {
                        $scope.gabs = [];
                        $scope.gabs = response;
                     });
                }
            });
        };
        $scope.deleteGab = function (index,gabId) {
            gabs.splice(index, 1);
            //toastr.info("index is " + index + " gab " + gabId);
            $scope.gabs = gabs;
            TimelineServices.DeleteGab(gabId,function(response, status)
            {
                toastr.info(response + " " + status);
            });

        };

        $scope.likeOrUnlikeGab = function(index,gabId)
        {
            if($scope.gabs[index].btnLike.state === $scope.states[0])
            {
                TimelineServices.LikeGab(gabId, function(response,status)
                {
                    if(status === 200 )
                    {
                        $scope.gabs[index].btnLike.state = $scope.states[1];
                       TimelineServices.GetGabsTimelineGlobal(function(response) {
                            $scope.gabs = response;
                        });
                    }
                    else
                    {
                        toastr.error("error with the server");
                    }

                });
            }
            else
            {
                TimelineServices.DislikeGab(gabId, function(response,status)
                {
                    if(status === 200)
                    {
                        $scope.gabs[index].btnLike.state = $scope.states[0];
                       TimelineServices.GetGabsTimelineGlobal(function(response) {
                            $scope.gabs = response;
                        });
                    }
                    else
                    {
                        toastr.error("error with the server");
                    }

                });
            }

        };
    })

    .controller('suggestionsGlobalCtrl', function($scope,$cookieStore, $location , ServerLink, TimelineServices , AuthenticationService, toastr){

        $scope.states = ['Follow', 'UnFollow'];

        $scope.getRecommended = function() {
                TimelineServices.GetRecommendedUsers(function (response, status) {
                    if (status === 200) {
                        var temp;
                        temp = response;
                        for (var j in temp) {
                            if (temp.hasOwnProperty(j)) {
                                if (temp[j].id == AuthenticationService.GetCredentials().currentUser.userID) {
                                    temp.splice(j, 1);

                                }
                            }
                        }

                        for (var i in temp) {
                            if (temp.hasOwnProperty(i)) {


                                temp[i].pictureProfile = ServerLink.GetBaseUrlFromServer() + '/user/picture/profile?userID=' + temp[i].id;
                                temp[i].btnFollow = {
                                    state: $scope.states[0],
                                    index: i

                                };
                            }
                        }
                        $scope.result = temp;
                    }
                    else {
                        $scope.result = {};
                    }
                });
            };

        $scope.getRecommended();

        $scope.followOrUnfollowUser = function(index,userId) {

          //  toastr.info($scope.result[index].btnFollow.state);
            //toastr.info( $scope.result[index].btnState);
            //  var users = $scope.result;
            if($scope.result[index].btnFollow.state === $scope.states[0])
            {
                TimelineServices.FollowUser(userId, function(response,status)
                {
                    if(status === 200 )
                    {
                        $scope.result[index].btnFollow.state = $scope.states[1];
                        $scope.getRecommended();
                    }
                    else
                    {
                        toastr.error("error with the server");
                    }

                });
            }
            else
            {
                TimelineServices.UnFollowUser(userId, function(response,status)
                {
                    if(status === 200 )
                    {
                        $scope.result[index].btnFollow.state = $scope.states[0];
                        $scope.getRecommended();

                    }
                    else
                    {
                        toastr.error("error with the server");
                    }

                });
            }

        };
    });



