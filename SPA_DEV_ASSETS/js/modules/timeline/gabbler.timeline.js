/**
 * Created by Antonin on 11/02/2015.
 */

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

        $scope.profileBackGroundPicture = TimelineServices.setBackgroundPicture();

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
    .controller('profileOverviewCtrl', ['$scope', '$cookieStore', '$location', 'AuthenticationService', 'TimelineServices', 'toastr', '$rootScope', '$timeout',
        function($scope,$cookieStore,$location,AuthenticationService,TimelineServices,toastr, $rootScope, $timeout){

    var user = null;
        $scope.token = $cookieStore.get("globals").currentUser.token;
        var userID = $cookieStore.get("globals").currentUser.userID;
        var updated = 0;
            $scope.updated = 0;
       TimelineServices.GetProfilePreview(function(response)
        {
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

            var file = "";
        $scope.uploadFiles = function(){
            file = $scope.myFile;
            //console.log('file is ' + JSON.stringify(file));
            toastr.info('file is ' + JSON.stringify(file));
            TimelineServices.uploadFileToUrl(file, function(response) {

                    $scope.profilePicture = TimelineServices.setProfilePicture();
                $scope.$broadcast('photoChanged');

            } );



        };

            //$scope.imageSource = "";

            /*var oldValue = $scope.profilePicture;
            var newValue = file;
            $scope.$watch('profilePicture',  function(newValue, oldValue)
            {
                if ( newValue !== oldValue) {

                    $scope.updated++;
                   //$scope.profilePicture = 'http://localhost:8082/gabbler/api/user/picture/profile?userID=' + userID;
                }
            });*/



    }])


    .controller('timelineCtrl', function($scope,$cookieStore, $location,TimelineServices,toastr, $rootScope, AuthenticationService){


        var gab = $scope.gab;
        var userID = $cookieStore.get("globals").currentUser.userID;
        var gabs = [];
      /*  if(AuthenticationService.GetCredentials() === "undefined" )
        {
            $location.path('/');
        }*/


        TimelineServices.GetMyGabs(function(response) {
            $scope.gabs = response;
        });


            setInterval(function () {
                $scope.$apply(function () {
                    TimelineServices.GetMyGabs(function(response) {
                        //$scope.gabs = response;
                        /*var formattedresponse = response;
                        gabs = response;
                        $scope.gabs = gabs;*/

                    /*for (var i in response) {
                        if (response.hasOwnProperty(i)) {
                            formattedresponse[i].pictureProfile = TimelineServices.setProfilePicture();
                        }
                    }*/



                    $scope.gabs = response;

                    // $scope.profilePicture = TimelineServices.setProfilePicture();
                    //$scope.profilePicture = 'http://localhost:8082/gabbler/api/user/picture/profile?userID=' + userID;
                });
                });
            }, 10000);


            TimelineServices.GetProfilePreview(function(response)
            {
                //toastr.info($cookieStore.get("globals").currentUser.userID);
                $scope.username = response.nickname;

            });


        $scope.addGab = function ()
        {
        TimelineServices.AddAGab($scope.gab,function(response)
        {
            if(response.id)
            {
               TimelineServices.GetMyGabs(function(response)
                {
                    gabs = response;
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

        // Like ou dislikes des gabs

        $scope.states = ['Like', 'Unlike'];
        $scope.likeOrUnlikeGab = function(index,gabId) {
            if ($scope.gabs[index].btnLike.state === $scope.states[0]) {
                TimelineServices.LikeGab(gabId, function (response, status) {
                    if (status === 200) {
                        $scope.gabs[index].btnLike.state = $scope.states[1];
                        //$scope.result[index].btnState = $scope.states[1];
                        TimelineServices.GetMyGabs(function (response) {
                            //$scope.gabs = response;
                            var formattedresponse = response;
                            gabs = response;
                            $scope.gabs = gabs;
                        });
                        toastr.info("gab like " + index + " " + gabId);
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
                        TimelineServices.GetMyGabs(function (response) {
                            //$scope.gabs = response;
                            var formattedresponse = response;
                            gabs = response;
                            $scope.gabs = gabs;
                        });
                        toastr.info("gab unlike" + index + " " + gabId);
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

            toastr.info($scope.result[index].btnFollow.state);
            //toastr.info( $scope.result[index].btnState);
          //  var users = $scope.result;
            if($scope.result[index].btnFollow.state === $scope.states[0])
            {
                TimelineServices.FollowUser(userId, function(response,status)
                {
                    if(status === 200 )
                    {
                        $scope.result[index].btnFollow.state = $scope.states[1];
                        //$scope.result[index].btnState = $scope.states[1];
                        //toastr.info("user followed"  + index + " " + userId);
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
                       // $scope.btnState = $scope.states[0];
                        toastr.info("user unfollowed"  + index + " " + userId);
                    }
                    else
                    {
                        toastr.error("error with the server");
                    }

                });
            }

        };
    });



