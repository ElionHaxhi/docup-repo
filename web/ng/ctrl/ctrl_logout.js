function logoutController($scope, $location, Login, App) {

    $scope.login = function () {
            $scope.dataLoading = true;
            Login.getDoctor($scope.username, $scope.password, function (response) {
                if (response.id !== 0) {
                   // AuthenticationService.SetCredentials($scope.username, $scope.password);
                    //window.location.href='http://localhost:8080/pvrepo';
                    $location.path('/patients/');
                    //Navbar.setTabSelected('patients');
                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            });
        };

    //$location.path('//');
      //  $window.location.href = 'http://localhost:8080/pvrepo/pvrepo.html';

}