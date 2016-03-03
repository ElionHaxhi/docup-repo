function measuresListCtrl($scope, $location, $routeParams, $translate, App, Navbar, Measure, Graphui, Gendialog, Patient, User, Flexschema) {

	$scope.user 	= User;
	$scope.measure 	= Measure;
	$scope.patient 	= Patient;
	$scope.flexform = Flexschema;

	$scope.appformats = App.params.formats;

	/*
	 * PUB FUNCS
	 */

	/**
	 * Refresh measures list
	 *
	 */
	$scope.refreshRecordList = function() {
		Measure.clearRecordList();

		var measurespatient = Patient.obj.id;
		if ($routeParams.patientid) {
			measurespatient = $routeParams.patientid;
		}

		Measure.getAllRecordsByPatientId(measurespatient, "VAL", function(ack, msg) {
			if (!ack) {
				Gendialog.openConfirmDialog($translate('GENERAL.ERR.SERVERFAIL'), msg);
			}
			else{
				Graphui.setLoading(false);
			}
		});
	};

	$scope.showTable = function(key){
		Measure.viz.currTable = key;
	};

	$scope.closeTable = function(){
		Measure.viz.currTable = null;
	};

	/**
	 * Create new measure
	 *
	 */
	$scope.openCreateNewRecord = function(dbname) {
		//Graphui.setLoading(true);
		var msgType = User.checkLicenseFreeLimit("EXA");
		if (!msgType) {
			$location.path('/measurecreate/' + dbname);
		} else {
			//Graphui.setLoading(false);
			Gendialog.openErrorLicenseFreeDialog(msgType);
		}
	};

	// executed from the route
	Graphui.setLoading(true);
	Navbar.setTabSelected('measures');

	if ($routeParams.patientid) {
		$scope.refreshRecordList();
	}
	else {
		if (Patient.obj.id && (_.isEmpty(Measure.graphs) || $location.path() === '/measureslist/refresh/')) {
			$scope.refreshRecordList();
		}
		else {
			Graphui.setLoading(false);
		}
	}
}
