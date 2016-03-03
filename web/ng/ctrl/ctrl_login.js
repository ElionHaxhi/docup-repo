function loginController($scope, $rootScope, $location, LoginAuthentication, App, Graphui) {

    $scope.graphui = Graphui;
    Graphui.setLoading(false);
    
    LoginAuthentication.ClearCredentials();
    App.setupConfigParamas();
    $scope.login = function () {
            $scope.dataLoading = true;
            LoginAuthentication.getDoctor($scope.username, $scope.password, function (response) {
                if (response.id !== 0) {
                    LoginAuthentication.SetCredentials($scope.username, $scope.password, response.id);
                   // jqLite.css("background-color","white");
                    //window.location.href='http://localhost:8080/pvrepo';
                    $location.path('/patients/');
                    //Navbar.setTabSelected('patients');
                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            });
        };

    //$location.path('/login/');


}