/**
 * Created by Antonin on 11/02/2015.
 */

angular.module('gabbler.timeline' , [

'gabbler.timeline.service'


])

    .controller('profileOverviewCtrl', function($scope,$cookieStore, $location,AuthenticationService,TimelineServices){

    var user = null;
        $scope.token = $cookieStore.get("globals").currentUser.token;

       TimelineServices.GetProfilePreview("0",function(response)
        {
            if (response.id) {
             //   AuthenticationService.SetCredentials($scope.username, response.token);
                //$scope.error = response.token;
                user = response;
                //$scope.error = $cookieStore.get("globals");
                // $route.reload();
                $scope.firstname = response.firstname;
                $scope.lastname = response.lastname;
                $scope.nickname = response.nickname;
                $scope.result = user.data;
            } else {
                console.log("Erreur");

            }
        });
    })


    .controller('timelineCtrl', function($scope,$cookieStore, $location,TimelineServices){


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
            TimelineServices.GetProfilePreview(formattedresponse[gab].userId,function(response)
            {
                $scope.username = response.nickname;

            });
            $scope.gabs = response;
        });
        $scope.addGab = function ()
        {

        TimelineServices.AddAGab($scope.gab,function(response)
        {
            if(response.id !== 0)
            {
               TimelineServices.GetMyGabs(function(response)
                {
                    $scope.gabs = response;


                });
            }
        });

    };





    })

    .controller('suggestionsCtrl', function($scope,$cookieStore, $location){







    });