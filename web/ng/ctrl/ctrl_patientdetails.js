function patientDetailsCtrl($scope, $location, $translate, $routeParams, App, Patient, Graphui, Navbar,
							Gendialog, Annotation, Flexschema, User, Exam, Service) {

	$scope.patient 		= Patient;
	$scope.exam 		= Exam;
	//$scope.annotation 	= Annotation;
	//$scope.service 		= Service;
	$scope.appformats 	= App.params.formats;

	// prepare patients filter
	//$scope.patienttypes = angular.copy(User.getAllPatientsTypeData());

	// sexstyle
	$scope.sexstyle = {
		type: 'dropdown',
		list: [
			{
				"text":$translate('PATIENT.FORM.MALE'),
				"value":"M"
			},
			{
				"text":$translate('PATIENT.FORM.FEMALE'),
				"value":"F"
			}
		]
	};

	// graph exams timeline
	$scope.examstimeline = {
		data: [],
		options: {}
	};

	/*
	 * PRIV FUNCS
	 */

	/**
	 * Get flexforms
	 *
	 */
	var getFlexforms = function(flexname, callback) {
		Flexschema.getFlexSchema('patient', 'jsonpatient_001_IT', 'patient_fixform', function(ack, msg, payload) {
			if (!ack) {
				callback(false);
			} else {
				Patient.lastfixform = payload;
				Flexschema.getFlexSchema('patient', flexname, 'patient_flexform', function(ack, msg, payload) {
					if (!ack) {
						callback(false);
					} else {
						Patient.lastflexschema = payload;
						callback(true);
					}
				});
			}
		});
	};

	/*
	 * PUB FUNCS
	 */
    $scope.refreshVisitsListOfThisPatient = function(){

        Exam.getAllExamsByPatientId($routeParams.id, "EXAM", function(ack, msg) {
            if (!ack) {
                Gendialog.openConfirmDialog($translate('GENERAL.ERR.SERVERFAIL'), msg);
            }
            else{
                Graphui.setLoading(false);
                $scope.refreshExamsTimeline();

            }
        });
    }

	/**
	 * Get patient details and prepare all the elements related to the patient details view
	 *
	 */
	$scope.refreshPatientDetails = function() {
		var locationpath = $location.path();
		var locationarr = locationpath.split('/');

		// case of get patient details
		if (locationarr[1] == 'patientdetail') {
			if ($routeParams.id) {
				// case of open patient
				Patient.viz.create = false;
				Patient.viz.write = false;
				// get patient details
				Patient.getPatientDetails($routeParams.id, function(ack, msg) {
					//console.log('Patient details loaded');
					// prepare the flexforms
					Graphui.setLoading(false);
					/*getFlexforms(Patient.obj.jsondata_type, function(ack) {
						if (!ack) {
							Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), msg);
						}
						Graphui.setLoading(false);
					});*/
				});
                $scope.refreshVisitsListOfThisPatient();

            } else {
				Graphui.setLoading(false);
			}
		} else if (locationarr[1] === 'patientcreate') {
			Patient.clearPatientObj();
			Patient.closeAllSections();

			//console.log('Open patient creation form');
			// case of patient creation
			Patient.viz.create = true;
			Patient.viz.write = true;
			Patient.setTab(false, true, false, false);
			// prepare the flexforms
			/*var flexformname = Flexschema.getInitialFlexformByName('patient', 'patient_flexform');
			getFlexforms(flexformname, function(ack, msg) {
				if (!ack) {
					Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), msg);
				}
				Graphui.setLoading(false);
			});*/

				Graphui.setLoading(false);

		} else {
			Graphui.setLoading(false);
		}
	};

	/**
	 * Control write page and data to load
	 *
	 */
	$scope.checkPatientIsLoaded = function() {
		return Patient.checkPatientIsLoaded() || Patient.checkCreateState();
	};

	/**
	 * Edit mode
	 *
	 */
	$scope.checkFormEnabled = function() {
		return Patient.checkWriteState();
	};

	/**
	 * Check if the tab is active
	 *
	 * @param {integer} tabnumber number of the tab
	 */
	$scope.checkTabIsActive = function(tabnumber) {
		if (Patient.getTabStatus(tabnumber)) {
			return 'active';
		} else {
			return '';
		}
	};

	/**
	 * Get the status of the tab
	 *
	 * @param {integer} tabnumber number of the tab
	 */
	$scope.getTabStatus = function(tabnumber) {
		return Patient.getTabStatus(tabnumber);
	};

	/**
	 * Set the status of the tab
	 *
	 * @param {integer} tabnumber number of the tab
	 */
	$scope.setTab = function(tabnumber) {
		if (tabnumber == 0) {
			Patient.setTab(true, false, false, false);
		}
		if (tabnumber == 1) {
			Patient.setTab(false, true, false, false);
		}
		if (tabnumber == 2) {
			Patient.setTab(false, false, true, false);
		}
		if (tabnumber == 3) {
			Patient.setTab(false, false, false, true);
		}
	};

	/**
	 * Check if delete button is enabled,
	 *
	 */
	$scope.checkCreationEnabled = function() {
		return Patient.checkWriteState() && Patient.checkCreateState();
	};

	/**
	 * Create a copy of server data
	 *
	 */
	$scope.enableUpdatePatientDetails = function() {
		Patient.backupPatient();
		Patient.viz.write = true;
		if(Patient.getTabStatus(0)){
			Patient.setTab(false, true, false, false);
		}
	};

	/**
	 * Reload the copy of server data
	 *
	 */
	$scope.backPatientUpdate = function() {
		Patient.revertBackupPatient();
		Patient.viz.write = false;
		// case of revert in the case of creation
		if (Patient.viz.create) {
			Patient.viz.create = false;
			$location.path('/patients/');
		}
	};

	/**
	 * Create or Update the patient
	 *
	 */
	$scope.updatePatientDetails = function() {
		if ($scope.editPatientForm.$valid) {
			// update or creation
			//Graphui.setLoading(true);
			if (Patient.viz.create) {
				// case of creation
				Patient.createPatientDetails(function(ack, msg, payload) {
					if (ack) {
						// creation ok
						//console.log('ana');
						$location.path('/patientdetail/' + payload);
						Patient.getAllPatients(null);
					} else {
						// creation fail
						Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), msg);
						//Graphui.setLoading(false);
					}
				});
			} else {
				// case of update
				Patient.updatePatientDetails(function(ack, msg) {
					
					if (ack) {
						// update ok
						Patient.viz.create = false;
						Patient.viz.write = false;
						Patient.getAllPatients(null);
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
	 * Change patient type
	 *
	 * @param {string} typecode patient type code
	 */
	$scope.changePatientType = function(typecode) {
		Patient.updatePatientType(Patient.obj.id, typecode, function(ack, msg) {
			if (!ack) {
				Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), msg);
			} else {
				Patient.obj.pattype = typecode;
			}
		});
	};

	/**
	 * Dialog for delete a patient
	 *
	 */
	$scope.openDialogDeleteConfirm = function() {
		Gendialog.openConfirmDialog($translate('PATIENT.MSG.DELCONFIRM_TITLE'), $translate('PATIENT.MSG.DELCONFIRM_QUEST'), $scope.deletePatientDetails, null);
	};

	/**
	 * Delete the patient
	 *
	 */
	$scope.deletePatientDetails = function() {
		//Graphui.setLoading(true);
		Patient.deletePatient(Patient.obj.id, function(ack, msg) {
			if (ack) {
				$location.path('/patients/');
				Patient.clearPatientObj();
			} else {
				Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), msg);
				//Graphui.setLoading(false);
			}
		});
	};

	$scope.printPatientDetails = function() {
		Patient.printPatientDetails(Patient.obj.id);
	};

	$scope.refreshExamsTimeline = function() {
		//console.log("refresh exams timeline");
		var data = [];
		_.each(Exam.list, function(elem) {
			data.push({
				id: elem.id,
				content: elem.descriptionList[3].content,
				start: elem.creationDate
			});
		});
		$scope.examstimeline.data = data;
	};

	/**
	 * Open dialog to confirm episode delete
	 *
	 * @param {string} episodeid
	 */
	$scope.openDialogDeleteEpisodeConfirm = function(episodeid) {
		var dialogtitle = $translate('EXAM.MSG.DELEPISODECONFIRM_TITLE');
		var dialogmsg = $translate('EXAM.MSG.DELEPISODECONFIRM_QUEST');
		Gendialog.openConfirmDialog(dialogtitle, dialogmsg, $scope.deleteEpisode, [episodeid]);
	};

	/**
	 * Delete episode
	 *
	 * @param {string} episodeid
	 */
	$scope.deleteEpisode = function(episodeid) {
		Exam.deleteEpisode(episodeid, callbackSaveEpisode);
	};

	var callbackSaveEpisode = function(ack, msg) {
		if (ack) {
			Exam.getAllExamsByPatientId($scope.patient.obj.id, "EXAM", function(ack, msg) {
				if (!ack) {
					Gendialog.openConfirmDialog($translate('GENERAL.ERR.SERVERFAIL'), msg);
				}
				//Graphui.setLoading(false);
			});
		} else {
			Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), msg);
		}
	};

	// executed from the route
	Navbar.setTabSelected('patientdetail');
	Graphui.setLoading(true);
	$scope.refreshPatientDetails();

    if(!$scope.exam.list.length === 0){
        $scope.$watch('exam.list', function() {
            $scope.refreshExamsTimeline();
        });
    }
    else{
        $scope.refreshExamsTimeline();
    }



}