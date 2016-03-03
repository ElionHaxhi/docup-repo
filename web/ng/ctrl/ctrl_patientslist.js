function patientsListCtrl($scope, $routeParams, $cookieStore ,$location, $translate, App, Navbar, Patient, User, LoginAuthentication , Graphui, Gendialog) {
	
	/*
	 * SCOPE
	 */
	
	
	$scope.patient = Patient;
	$scope.searchQuery = '';
	$scope.appformats = App.params.formats;
	$scope.login = LoginAuthentication;
	// for the types lists
	//$scope.user = User;
	// prepare patients filter
	//$scope.patienttypes = angular.copy(User.getAllPatientsTypeData());
	
	/*
	 * PUB FUNCS
	 */
	
	$scope.refreshPatientsList = function() {
		Patient.getAllPatients(function() {
			Graphui.setLoading(false);
			console.log('Fetch patients list');

		});
	};
	
	/**
	 * Create new patient
	 * 
	 */
	$scope.openCreateNewPatient = function() {
		
		$location.path('/patientcreate/');
		
		/*msgCheckLic = User.checkLicenseFreeLimit("PAT");
		if (!msgCheckLic) {
			$location.path('/patientcreate/');
		} else {
			Gendialog.openErrorLicenseFreeDialog(msgCheckLic);
		}*/
	};
	
	/**
	 * Get patient type object
	 * 
	 * @param {string} typecode patient type code
	 */
	$scope.getPatientTypeObj = function(typecode) {
		var typeobj = User.getPatientTypeData(typecode);
		if (typeobj) {
			return typeobj;
		} else {
			return null;
		}
	};




	/**
	 * Set patient type filter
	 * 
	 * @param {string} typecode exam type code
	 */
	$scope.setFilterPatientType = function(typecode) {
		Patient.filter.pattype = typecode;
		$scope.refreshPatientsList();
	};

	
	// executed from the route
	Graphui.setLoading(true);
	Navbar.setTabSelected('patients');
	//$scope.refreshPatientsList();
	if (!Patient.list || $location.path() === '/patients/') {
		console.log('ok faccio refresh');
		$scope.refreshPatientsList();
	} else {
		Graphui.setLoading(false);
		if (Patient.list.length <= 0) {
			Navbar.openContextualGuide('patients');
		}
	}
	
}

/*
 * FILTERS
 */
App.filter('filterPatient', function() {
	return function(items, filter, fieldname) {
		var filtered = [];
		angular.forEach(items, function(item) {
			if (!filter) {
				filtered.push(item);
			} else if (item[fieldname] == filter) {
    			filtered.push(item);
			}
		});
		return filtered;
	};
});
	