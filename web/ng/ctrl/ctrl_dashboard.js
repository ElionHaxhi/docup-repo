function dashboardCtrl($scope, $location, $translate, App, Navbar, Gendialog, User, Patient, Agenda) {
	
	/*
	 * SCOPE
	 */
	$scope.user = User;
	$scope.agenda = Agenda;
	$scope.app = App;
	$scope.appformats = App.params.formats;
	$scope.filter = {};
	$scope.filter.doctors = angular.copy(User.getAllDoctorsTypeData());
	$scope.filter.studios = angular.copy(User.getAllStudiosTypeData());
	$scope.filter.limit = 10;
	$scope.filter.doctor = null;
	$scope.filter.studio = null;
	
	/*
	 * PUB FUNCS
	 */
	
	$scope.refreshWorklist = function() {
		////console.log('Fetch worklist');
		// check filters
		var filterDoctor = null;
		if ($scope.filter.doctor && $scope.filter.doctor.id) {
			filterDoctor = $scope.filter.doctor.id;
		}
		var filterStudio = null;
		if ($scope.filter.studio && $scope.filter.studio.id) {
			filterStudio = $scope.filter.studio.id;
		}
		// load the worklist
		Agenda.getWorklist($scope.filter.limit, filterDoctor, filterStudio, function(ack, msg, payload) {
			if (!ack || !payload) {
				Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), msg);
			} else {
				$scope.worklist = Agenda.worklist;
			}
		});
	};
	
	$scope.filterRows = function(filter) {
		$scope.filter.limit = filter;
		$scope.refreshWorklist();
	};
	
	$scope.filterDoctor = function(filter) {
		$scope.filter.doctor = filter;
		$scope.refreshWorklist();
	};
	
	$scope.filterStudio = function(filter) {
		$scope.filter.studio = filter;
		$scope.refreshWorklist();
	};
	
	$scope.getDoctorsList = function() {
		return User.getAllDoctorsTypeData();
	};
	
	$scope.getStudiosList = function() {
		return User.getAllStudiosTypeData();
	};
	
	$scope.getLicenseName = function() {
		return User.getLicenseName(true);
	};
	
	$scope.printWorklist = function() {
		Agenda.printWorklist();
	};
	
	// load the news
	User.getAllNews(function(ack, msg, payload) {
		$scope.news = User.news;
	});

	$scope.refreshWorklist();
	
	// preload the patients list
	if ($location.path() === '/dashboard/refreshpatients/') {
		Patient.getAllPatients(function() {
			if (Patient.list.length <= 0) {
				Navbar.openContextualGuide();
			}
		});
	}
	
	Navbar.setTabSelected('dashboard');
	//Graphui.setLoading(false);
	
}