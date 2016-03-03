function navbarCtrl($scope, Navbar, User, Config, Patient, LoginAuthentication, Exam, Measure) {
	
	$scope.navbar = Navbar;
	$scope.patient = Patient;
	$scope.login = LoginAuthentication;
    $scope.exam = Exam;
	
	
	
	$scope.openContextualGuide = function() {
		Navbar.openContextualGuide();
	};

}