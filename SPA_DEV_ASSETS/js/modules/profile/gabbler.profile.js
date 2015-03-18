angular.module('gabbler.profile',[

'toastr'

])

.controller('profileCtrl', ['$scope', '$rootScope', '$location', 'ProfileService', 'AuthenticationService', 'toastr',
        function($scope,$rootScope,$location, ProfileService, AuthenticationService, toastr)
        {
            // Binding Data
            ProfileService.GetUserDatas(function(response)
            {
                    $scope.result = response;
                    $scope.firstname = response.firstname;
                    $scope.lastname = response.lastname;
                    $scope.birthdate = new Date(response.birthdate);
                    $scope.username = response.nickname;
                    $scope.displayname = response.displayName;
                    $scope.email = response.email;
            });

            $scope.updateProfile = function()
            {
                ProfileService.UpdateUserDatas($scope.firstname,$scope.lastname,$scope.username,$scope.displayname,$scope.email, $scope.birthdate, function(response)
                {

                    if (response)
                    {
                        toastr.success('Your profile has been updated successfully !');
                        $scope.result = response;

                        $scope.apply();

                    }
                    else

                    {
                        toastr.error('Error while update of your profile');
                    }
                });
            };

            $scope.updatePassword = function()
            {
                ProfileService.UpdatePassword($scope.oldPassword,$scope.newPassword, function(response)
                {
                    if(response.success)
                    {
                        toastr.info("Password has been successfully updated !");
                    }
                    else if(response.error)
                    {
                        toastr.error("Error during update of your password", "Please try again later");
                    }
                });
            };
        }
]);