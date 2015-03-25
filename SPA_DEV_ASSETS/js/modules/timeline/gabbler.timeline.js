/**
 * Created by Antonin on 11/02/2015.
 */

angular.module('gabbler.timeline' , [

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


    .controller('timelineCtrl', function($scope,$cookieStore, $location,TimelineServices,toastr, $rootScope){


        var gab = $scope.gab;
        var userID = $cookieStore.get("globals").currentUser.userID;
        var gabs = [];


        TimelineServices.GetMyGabs(function(response) {
            //$scope.gabs = response;
            var formattedresponse = response;
            for (var gab in formattedresponse) {
                if (formattedresponse.hasOwnProperty(gab)) {
                    var date = new Date(formattedresponse[gab].postDate * 1000);
                    // hours part from the timestamp
                    var hours = date.getHours();
                    // minutes part from the timestamp
                    var minutes = "0" + date.getMinutes();
                    // seconds part from the timestamp
                    var seconds = "0" + date.getSeconds();

                    // will display time in 10:30:23 format
                    var formattedTime = hours + ':' + minutes.substr(minutes.length - 2) + ':' + seconds.substr(seconds.length - 2);
                    //$scope.date = "";
                    $scope.date = formattedTime;
                  //  $scope.profilePicture = 'http://localhost:8082/gabbler/api/user/picture/profile?userID=' + userID;
                    $scope.profilePicture = TimelineServices.setProfilePicture();
                }

            }
            /*$scope.$watch('photoChanged', function()
            {
                $scope.profilePicture = TimelineServices.setProfilePicture();


            });*/
           setInterval(function () {
                $scope.$apply(function () {
                    $scope.profilePicture = TimelineServices.setProfilePicture();
                    //$scope.profilePicture = 'http://localhost:8082/gabbler/api/user/picture/profile?userID=' + userID;
                });
            },10000);

            TimelineServices.GetProfilePreview(function(response)
            {
                //toastr.info($cookieStore.get("globals").currentUser.userID);
                $scope.username = response.nickname;

            });
            gabs = response;
            $scope.gabs = gabs;
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






    })

    .controller('suggestionsCtrl', function($scope,$cookieStore, $location ){

        $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

    });



