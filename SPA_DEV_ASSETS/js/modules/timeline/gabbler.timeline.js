/**
 * Created by Antonin on 11/02/2015.
 */
var optionalVisitedUserId;
angular.module('gabbler.timeline' , [

    'gabbler.server.service',
    'gabbler.timeline.service',
    'toastr' ,
    'ui.bootstrap' ,
    'gabbler.login.service'


])
    // directive mise en place pour l'image de profil de l'utilisateur
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
    // directive permettant de charger l'image de couverture
    .directive('fileModelBackground', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModelBackground);
                var modelSetter = model.assign;

                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }])

    // Controller gérant l'image de couverture
    .controller('profileBackgroundCtrl', function($scope, $location, TimelineServices)
    {
        if (typeof($location.search().userId) !== "undefined")
        {
            optionalVisitedUserId = $location.search().userId;
            $scope.disabledButtons = true;

        }
        else
        {
            optionalVisitedUserId = 0;
            $scope.disabledButtons = false;

        }

        $scope.profileBackGroundPicture = TimelineServices.setBackgroundPicture(optionalVisitedUserId);

        var file = {};
        $scope.uploadFiles = function() {
            file = $scope.myFile;
            //console.log('file is ' + JSON.stringify(file));
            //toastr.info('file is ' + JSON.stringify(file));
            TimelineServices.uploadPictureBackground(file, function (response) {

                $scope.profileBackGroundPicture = TimelineServices.setBackgroundPicture();
               // $scope.$broadcast('photoChanged');

            });
        };
    })

    // Controller gérant la partie profil de l'utilisateur
    .controller('profileOverviewCtrl', ['$scope', '$cookieStore', '$location', 'AuthenticationService', 'TimelineServices', 'toastr', '$rootScope', '$timeout', '$window',
        function($scope,$cookieStore,$location,AuthenticationService,TimelineServices,toastr, $rootScope, $timeout, $window){
            if(typeof($cookieStore.get("globals")) === "undefined") {

                $location.path("/");
                $window.reload();
            }

        var user = null;
        $scope.token = $cookieStore.get("globals").currentUser.token;
        var userID = $cookieStore.get("globals").currentUser.userID;

            if (typeof($location.search().userId) !== 'undefined')
            {
                optionalVisitedUserId = $location.search().userId;
                $scope.disabledButtons = true;
            }
            else
            {
                optionalVisitedUserId = 0;
                $scope.disabledButtons = false;
            }

       $scope.getProfile = function() {
           TimelineServices.GetProfilePreview(optionalVisitedUserId, function (response) {
               if (response) {
                   //   AuthenticationService.SetCredentials($scope.username, response.token);
                   //$scope.error = response.token;
                   user = response;
                   //$scope.error = $cookieStore.get("globals");
                   // $route.reload();
                   $scope.displayname = response.displayName;
                   $scope.firstname = response.firstname;
                   $scope.lastname = response.lastname;
                   $scope.nickname = response.nickname;
                   $scope.result = user.data;
                   $scope.profilePicture = TimelineServices.setProfilePicture();
               } else {
                   console.log("Erreur");

               }
           });
       };

            $scope.getProfile();
            setInterval(function () {
                $scope.$apply(function () {
                    $scope.getProfile();
                });
            },10000);

            var file = "";
        $scope.uploadFiles = function(){
            file = $scope.myFile;
            //console.log('file is ' + JSON.stringify(file));

            TimelineServices.uploadFileToUrl(file, function(response) {

                    $scope.profilePicture = TimelineServices.setProfilePicture();
                $scope.$broadcast('photoChanged');

            } );
        };
    }])


    .controller('timelineCtrl', function($scope,$cookieStore, $location,TimelineServices,toastr, $rootScope, AuthenticationService ){




        if (typeof($location.search().userId) !== "undefined")
        {
            optionalVisitedUserId = $location.search().userId;
            $scope.disabledButtons = true;
        }
        else
        {
            optionalVisitedUserId = 0;
            $scope.disabledButtons = false;

        }

        var userID = $cookieStore.get("globals").currentUser.userID;
        var gabs = [];


        TimelineServices.GetMyGabs(optionalVisitedUserId,function(response) {
            $scope.gabs = response;
            gabs = response;
        });


            setInterval(function () {
                $scope.$apply(function () {
                    TimelineServices.GetMyGabs(optionalVisitedUserId,function(response) {
                    $scope.gabs = response;
                        gabs = response;
                });
                });
            }, 10000);


            TimelineServices.GetProfilePreview(optionalVisitedUserId,function(response)
            {
                //toastr.info($cookieStore.get("globals").currentUser.userID);
                $scope.username = response.nickname;

            });


        $scope.addGab = function () {
        TimelineServices.AddAGab($scope.sendGab,function(response)
        {
            if(response.id)
            {

               $scope.sendGab = '';
               TimelineServices.GetMyGabs(optionalVisitedUserId,function(response)
                {
                    $scope.gabs = response;
                    gabs = response;
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
                //toastr.info(response + " " + status);
            });

        };

        // Like ou dislikes des gabs

        $scope.states = ['Like', 'Unlike'];
        $scope.likeOrUnlikeGab = function(index,gabId) {
            if ($scope.gabs[index].btnLike.state === $scope.states[0]) {
                TimelineServices.LikeGab(gabId, function (response, status) {
                    if (status === 200) {
                        $scope.gabs[index].btnLike.state = $scope.states[1];
                        //$scope.result[index].btnState = $scope.states[1];
                        TimelineServices.GetMyGabs(optionalVisitedUserId,function (response) {

                            gabs = response;
                            $scope.gabs = gabs;
                        });

                    }
                    else {
                        toastr.error("error with the server");
                    }

                });
            }
            else {
                TimelineServices.DislikeGab(gabId, function (response, status) {
                    if (status === 200) {
                        $scope.gabs[index].btnLike.state = $scope.states[0];
                        // $scope.btnState = $scope.states[0];
                        TimelineServices.GetMyGabs(optionalVisitedUserId,function (response) {
                            gabs = response;
                            $scope.gabs = gabs;
                        });

                    }
                    else {
                        toastr.error("error with the server");
                    }

                });
            }

        };
    })

    .controller('suggestionsCtrl', function($scope,$cookieStore, $location , TimelineServices, toastr, ServerLink){

       // $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
       $scope.states = ['Follow', 'UnFollow'];
        $scope.searchUser = function()
        {
            TimelineServices.SearchUser($scope.search, function(response, status)
            {
                if(status === 200)
                {
                    var temp;
                    temp = response;
                    for (var j in temp) {
                        if (temp.hasOwnProperty(j)) {
                            if (temp[j].id == $cookieStore.get("globals").currentUser.userID) {
                                temp.splice(j,1);
                                return;
                            }
                        }

                    }
                    for (var i in temp) {
                        if (temp.hasOwnProperty(i)) {

                            if(temp[i].following === true){
                                temp[i].pictureProfile = ServerLink.GetBaseUrlFromServer() + '/user/picture/profile?userID=' + temp[i].id;
                                temp[i].btnFollow = {
                                    state: $scope.states[1],
                                    index: i

                                };
                            }
                            else {
                                temp[i].pictureProfile = ServerLink.GetBaseUrlFromServer() + '/user/picture/profile?userID=' + temp[i].id;
                                temp[i].btnFollow = {
                                    state: $scope.states[0],
                                    index: i

                                };
                            }
                        }
                    }
                    $scope.result = temp;

                    //$scope.btnState = $scope.states[0];
                }
                else
                {
                    $scope.result = {};
                }
            });
        };

        $scope.followOrUnfollowUser = function(index,userId) {

            ///toastr.info($scope.result[index].btnFollow.state);
            //toastr.info( $scope.result[index].btnState);
          //  var users = $scope.result;
            if($scope.result[index].btnFollow.state === $scope.states[0])
            {
                TimelineServices.FollowUser(userId, function(response,status)
                {
                    if(status === 200 )
                    {
                        $scope.result[index].btnFollow.state = $scope.states[1];
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
                    }
                    else
                    {
                        toastr.error("error with the server");
                    }

                });
            }

        };
    });



