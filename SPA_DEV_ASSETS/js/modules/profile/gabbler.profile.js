angular.module('gabbler.profile',[



])

.controller('profileCtrl', ['$scope', '$rootScope', '$location', 'ProfileService', 'AuthenticationService',
        function($scope,$rootScope,$location, ProfileService, AuthenticationService)
        {
            // Binding Data
            ProfileService.GetUserDatas("0",function(response)
            {
                    $scope.result = response;
                    $scope.firstname = response.firstname;
                    $scope.lastname = response.lastname;
                    $scope.birthdate = new Date(response.birthdate);
                    $scope.username = response.nickname;
                    $scope.email = response.email;
            });

            $scope.updateProfile = function()
            {
                ProfileService.UpdateUserDatas("0", $scope.firstname,$scope.lastname,$scope.username,$scope.email, $scope.birthdate, function(response)
                {
                    if (response.success)
                    {
                        $scope.result = response;
                    }
                });
            };
        }
]);