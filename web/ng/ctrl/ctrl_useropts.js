function useroptsFlexformsCtrl($scope, $location, $translate, Gendialog, Flexschema, User, Graphui, Agenda) {
	
	$scope.flexform = Flexschema;
	
	$scope.updateUseroptsFlexforms = function() {
		//Graphui.setLoading(true);
		var backup = angular.copy(User.info.json_admin);

		User.updateJsonAdminParam('flexpatienttype', 'appparam', Flexschema.flex.initial.patient.patient_flexform);
		User.updateJsonAdminParam('flexmeasuretype', 'appparam', Flexschema.flex.initial.measure.measure_flexform);
		User.updateJsonAdminParam('flexformtype', 'appparam', Flexschema.flex.initial.exam.exam_flexform);

		User.updateJsonAdmin(function(result){
			if (result) {
				$location.path('/dashboard/');
			}
			else{
				Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), $translate('FLEXFORM.ERR.UPDFLEXFAIL'));
				User.info.json_admin = backup;
				//Graphui.setLoading(false);
			}
		});
	};
	
}

function useroptsSettingsCtrl($scope, $location, Gendialog, User, Graphui) {
	
	$scope.useradmin = User;
	
	$scope.updateUseroptsSettings = function() {
		//Graphui.setLoading(true);
		User.updateJsonAdmin(function(result) {
			if (result) {
				$location.path('/dashboard/');
			} else {
				Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), $translate('SETTINGS.ERR.UPDSETTINGSFAIL'));
				//Graphui.setLoading(false);
			}
		});
	};
		
};

function useroptsCultureCtrl($scope, $location, Gendialog, User, Graphui) {
	
	$scope.useradmin = User;
	
	$scope.updateUseroptsSettings = function() {
		//Graphui.setLoading(true);
		User.updateJsonAdmin(function(result) {
			if (result) {
				$location.path('/dashboard/');
			} else {
				Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), $translate('SETTINGS.ERR.UPDSETTINGSFAIL'));
				//Graphui.setLoading(false);
			}
		});
	};
		
};

function useroptsCalendarsCtrl($scope, $location, Gendialog, User, Graphui, Agenda, CalendarData, EventSourceFactory) {
	
	$scope.useradmin = User;
	$scope.authNeeded = true;
	
	$scope.updateUseroptsSettings = function() {
		//Graphui.setLoading(true);
		User.updateJsonAdmin(function(result) {
			if (result) {
				Agenda.prepareAgendaDefaults();
				$location.path('/dashboard/');
			} else {
				Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), $translate('SETTINGS.ERR.UPDSETTINGSFAIL'));
				//Graphui.setLoading(false);
			}
		});
	};
	
	/*
	 * Google
	 */
	$scope.googleRequestAuth = function(view, calendar) {
		gapi_helper.requestAuth();
    };
    
    // configure gapi-helper
	gapi_helper.configure({
		clientId: '1016510701517.apps.googleusercontent.com',
		apiKey: 'AIzaSyDiXgNeZOW5ZTWDEppiF-exh-ov6xM31N0',
		scopes: 'https://www.googleapis.com/auth/calendar',
		services: {
		  calendar: 'v3'
		}
	});
	
	// check auth is ok
	gapi_helper.when('authorized', function() {
		$scope.$apply(function() {
			$scope.authNeeded = false;
		});
	});
	
	gapi_helper.when('authFailed', function() {
		$scope.$apply(function() {
			$scope.authNeeded = true;
		});
	});
	
};

