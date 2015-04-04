/**
 * Created by Antonin on 11/02/2015.
 */

angular.module('gabbler.timeline.global' , [

    'gabbler.timeline.service', 'toastr' , 'ui.bootstrap'


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
    .controller('profileOverviewGlobalCtrl', ['$scope', '$cookieStore', '$location', 'AuthenticationService', 'TimelineServices', 'toastr', '$rootScope', '$timeout',
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
                    //$scope.displayname = response.displayName;
                    $scope.firstname = response.firstname;
                    $scope.lastname = response.lastname;
                    $scope.nickname = response.nickname;
                    $scope.result = user.data;
                    $scope.profilePicture = TimelineServices.setProfilePicture();
                    $scope.coverPicture = TimelineServices.setBackgroundPicture();
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
        }])


    .controller('timelineGlobalCtrl', function($scope,$cookieStore, $location,TimelineServices,toastr, $rootScope){

        var gab = $scope.gab;
        var userID = $cookieStore.get("globals").currentUser.userID;
        var gabs = [];
        $scope.states = ['Like', 'Unlike'];



        TimelineServices.GetGabsTimelineGlobal(function(response) {
            //$scope.gabs = response;

            $scope.gabs = response;



           /* TimelineServices.GetProfilePreview(function(response)
            {
                //toastr.info($cookieStore.get("globals").currentUser.userID);
                $scope.username = response.nickname;

            });
            gabs = response;
            $scope.gabs = gabs;*/
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
                    TimelineServices.GetGabsTimelineGlobal(function(response) {
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
                        //$scope.result[index].btnState = $scope.states[1];
                        toastr.info("gab like "  + index + " " + gabId );
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
                    if(status === 200 )
                    {
                        $scope.gabs[index].btnLike.state = $scope.states[0];
                        // $scope.btnState = $scope.states[0];
                        toastr.info("gab unlike"  + index + " " + gabId);
                    }
                    else
                    {
                        toastr.error("error with the server");
                    }

                });
            }

        };
    })

    .controller('suggestionsGlobalCtrl', function($scope,$cookieStore, $location ){

        $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

    });


