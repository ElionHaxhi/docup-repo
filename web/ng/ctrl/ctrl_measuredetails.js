function measureDetailsCtrl($scope, $location, $routeParams, $translate, App, Measure, Patient, User, Graphui, Annotation, Service, Flexschema, Navbar, Gendialog) {

	$scope.user 			= User;
	$scope.measure 			= Measure;
	$scope.patient 			= Patient;
	$scope.annotation 		= Annotation;
	$scope.service 			= Service;
	$scope.flexserv 		= Flexschema;

	$scope.appformats 		= App.params.formats;
	$scope.oldFlexName		= null;

	/*
	 * PRIV FUNCS
	 */

	/**
	 * Get flexforms
	 *
	 */
	var getFlexforms = function(flexname, callback) {
		Flexschema.getFlexSchema('measure', flexname, 'measure_flexform', function(ack, msg, payload) {
			if (!ack) {
				callback(false);
			} else {
				Measure.lastflexschema = payload;
				callback(true);
			}
		});
	};

	/*
	 * PUB FUNCS
	 */

	/**
	 * Get patient details and prepare all the elements related to the patient details view
	 *
	 */
	$scope.refreshRecordDetails = function() {
		var locationpath = $location.path();
		var locationarr = locationpath.split('/');

		// case of get measure details
		Measure.viz.navDetail = true;
		if (locationarr[1] == 'measuredetail') {
			if ($routeParams.id) {
				//console.log('Load measure details');
				Measure.createState(false);

				// get record details
				Measure.getRecordDetails($routeParams.id, function(ack, msg) {
					//console.log('Measure details loaded');
					// prepare the flexforms
					getFlexforms(Measure.obj.jsondata_type, function(ack) {
						if (!ack) {
							Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), msg);
						}

						Measure.writeState(true);
						//Graphui.setLoading(false);
					});
				});
			} else {
				Measure.writeState(true);
				//Graphui.setLoading(false);
			}
		} else if (locationarr[1] === 'measurecreate') {
			//console.log('Open measure creation form');

			var flexformname = Flexschema.getInitialFlexformByName('measure', 'measure_flexform');
			if ($routeParams.measureid) {
				flexformname = $routeParams.measureid;
			}

			Measure.clearRecordObj();
			Measure.createState(true);
			Measure.writeState(true);

			Measure.getLastRecordByType(Patient.obj.id, flexformname, function(ack, msg, payload){
				Measure.obj.examdate = moment().format('YYYY-MM-DD HH:mm:ss');

				getFlexforms(flexformname, function(ack, msg) {
					if (!ack) {
						Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), msg);
					}
					Graphui.setLoading(false);
				});
			});

		} else {

			Measure.writeState(true);
			//Graphui.setLoading(false);
		}
	};

	/**
	 * Check if the record is loaded
	 *
	 */
	$scope.checkRecordIsLoaded = function() {
		return Measure.checkRecordIsLoaded() || Measure.checkCreateState();
	};

	/**
	 * Check if the form is enabled in the case of creation and update
	 *
	 */
	$scope.checkFormEnabled = function() {
		return Measure.checkWriteState();
	};

	/**
	 * Check user license
	 *
	 * @returns {boolean}
	 */
	$scope.checkLicense = function () {
		return (User.info.trial == "P");
	};

	/**
	 * Check if the delete is enabled
	 *
	 */
	$scope.checkDeleteEnabled = function() {
		if (Measure.checkWriteState()) {
			return !Measure.checkCreateState();
		} else {
			return false;
		}
	};

	/**
	 * Check if the form is in creation or update state
	 *
	 */
	$scope.checkCreationEnabled = function() {
		return Measure.checkWriteState() && Measure.checkCreateState();
	};

	/**
	 * Create a copy of server data and save the last flex schema name
	 *
	 */
	$scope.enableUpdateRecordDetails = function() {
		Measure.backupRecord(angular.copy(Measure.obj));
		$scope.oldFlexName = angular.copy(Flexschema.flex.current.measure.measure_flexform);
		Measure.writeState(true);
	};

	/**
	 * Reload the copy of server data and reset the old flexschema
	 *
	 */
	$scope.backRecordUpdate = function() {
		//Graphui.setLoading(true);
		$scope.measure.obj = Measure.checkBackupRecord();
		$location.path('/measureslist/');
		//Graphui.setLoading(false);
	};

	/**
	 * Create or Update the record
	 *
	 */
	$scope.updateRecordDetails = function() {
		var msgType = User.checkLicenseFreeLimit("EXA");
		if (!msgType) {
			if ($scope.editRecordForm.$valid) {
				if (Measure.checkCreateState()) {
					Measure.createRecordDetails(Patient.obj.id, "VAL", function(ack, msg, newpatientid) {
						if (ack && newpatientid) {
							// creation ok
							$location.path('/measureslist/refresh');
							Measure.getAllRecordsByPatientId(Patient.obj.id, "VAL");
						} else {
							Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), msg);
							//Graphui.setLoading(false);
						}
					});
				} else {
					Measure.updateRecordDetails(function(ack, msg) {
						if (ack) {
							// update ok
							Measure.createState(false);
							Measure.writeState(false);
							Measure.getAllRecordsByPatientId(Patient.obj.id, "VAL");
						} else {
							// update fail
							Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), msg);
						}
						//Graphui.setLoading(false);
					});
				}
			} else {
				Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), $translate('GENERAL.FORM.FORMNOTVALID') + '. ' + $translate('GENERAL.FORM.FORMCHECKMANDATORY') + '.');
			}
		} else {
			Gendialog.openErrorLicenseFreeDialog(msgType);
		}
	};

	/**
	 * Dialog for delete a record
	 *
	 */
	$scope.openDialogDeleteConfirm = function() {
		Gendialog.openConfirmDialog($translate('MEASURE.MSG.DELMEASURECONFIRM_TITLE'), $translate('MEASURE.MSG.DELMEASURECONFIRM_QUEST'), $scope.deleteRecordDetails);
	};

	/**
	 * Delete the record
	 *
	 */
	$scope.deleteRecordDetails = function() {
		//Graphui.setLoading(true);
		Measure.writeState(false);
		Measure.deleteRecord(Measure.obj.id, function(ack, msg) {
			if (ack) {
				$location.path('/measureslist/refresh/');
				Measure.clearRecordObj();
			} else {
				Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), msg);
				//Graphui.setLoading(false);
			}
		});
	};

	$scope.printRecordDetails = function() {
		Measure.printRecordDetails(Measure.obj.id);
	};

	// executed from the route
	//Graphui.setLoading(true);

	// show page
	Navbar.setTabSelected('measure');
	$scope.refreshRecordDetails();
}