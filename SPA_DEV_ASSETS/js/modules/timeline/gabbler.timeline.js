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


    .controller('profileOverviewCtrl', ['$scope', '$cookieStore', '$location', 'AuthenticationService', 'TimelineServices', 'toastr',
        function($scope,$cookieStore, $location,AuthenticationService,TimelineServices,toastr){

    var user = null;
        $scope.token = $cookieStore.get("globals").currentUser.token;


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
                $scope.profilePicture = '../../../img/alvinMario.jpg';
            } else {
                console.log("Erreur");

            }
        });


        $scope.uploadFiles = function(){
            var file = $scope.myFile;
            //console.log('file is ' + JSON.stringify(file));
            toastr.info('file is ' + JSON.stringify(file));
            TimelineServices.uploadFileToUrl(file, function(response) {
                /*setInterval(function () {
                    $scope.$apply(function () {
                        $scope.profilePicture = response.data;
                    });
                }, 2000);*/

                }

            );

        };
    }])


    .controller('timelineCtrl', function($scope,$cookieStore, $location,TimelineServices,toastr){


        var gab = $scope.gab;
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

                }

            }
            TimelineServices.GetProfilePreview(function(response)
            {
                //toastr.info($cookieStore.get("globals").currentUser.userID);
                $scope.username = response.nickname;

            });
            $scope.gabs = response;
        });
        $scope.addGab = function ()
        {

        TimelineServices.AddAGab($scope.gab,function(response)
        {
            if(response.success)
            {
               TimelineServices.GetMyGabs(function(response)
                {
                    $scope.gabs = response;


                });
            }
        });

    };





    })

    .controller('suggestionsCtrl', function($scope,$cookieStore, $location ){

        $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

    });



