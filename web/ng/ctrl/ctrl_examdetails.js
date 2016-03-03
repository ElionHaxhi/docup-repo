function examDetailsCtrl($scope, $location, $routeParams, $translate, App, Exam, Patient, Agenda, User, Graphui, Annotation, Service, Flexschema, Navbar, Gendialog) {
	
	/*
	 * PRIV FUNCS
	 */
	$scope.user = User;
	$scope.exam = Exam;
	$scope.patient = Patient;
	$scope.annotation = Annotation;
	$scope.service = Service;
	$scope.appformats = App.params.formats;
	// flexforms
	$scope.flexschema = Flexschema;
	$scope.flexform = null;
	// for pro user to change the current flexform
	$scope.oldExamFlexName = null;
	// $scope.showListFlexExam = null;
	// $scope.showModifyFlexExam = null;
	//inizialize previous visit and next visit button
	$scope.previousdis = false;
	$scope.nextdis = false;
	// prepare patients filter
	$scope.examtypes = angular.copy(User.getAllAppointsTypeData());
	// page layout
	$scope.viz = {
		serviceIsOpen: false,
		serviceIsFullHeight: false,
		annotationIsOpen: false,
		annotationIsFullHeight: false,
		attachIsOpen: false,
		attachIsFullHeight: false,
		graphIsOpen: false,
		graphIsFullHeight: false
	};
	
	/*
	 * PRIV FUNCS
	 */
	/**
	 * Get flexforms
	 * 
	 */
	var getFlexforms = function(flexname, callback) {
		Flexschema.getFlexSchema('exam', flexname, 'exam_flexform', function(ack, msg, payload) {
			if (!ack) {
				callback(false);
			} else {
				Exam.lastflexschema = payload;
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
	$scope.refreshExamDetails = function() {
		var locationpath = $location.path();
		var locationarr = locationpath.split('/');

		Exam.viz.navDetail = true;
		// case of get exam details
		if (locationarr[1] == 'examdetail') {
			if ($routeParams.id) {
				//console.log('Load exam details');
				//Exam.createState(false);
				Exam.writeState(false);
				Exam.setTab(true, false);
				// get exam details
				Exam.getExamDetails($routeParams.id, function(ack, msg) {
					//console.log('Exam details loaded');
					// prepare the flexforms
                    Graphui.setLoading(false);
                    Exam.viz.navDetail = true;

//                    getFlexforms(Exam.obj.jsondata_type, function(ack) {
//						if (!ack) {
//							Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), msg);
//						}
//						Graphui.setLoading(false);
//					});
				});
			} else {
				Graphui.setLoading(false);
			}
		} else if (locationarr[1] === 'examcreate') {
			//console.log('Open exam creation form');
			Exam.clearExamObj();
			Exam.createState(true);
			Exam.writeState(true);
			Exam.setTab(true, false);
			Exam.closeAllSections();

			// prepare the flexforms

			/*	Exam.obj.examdate = moment().format('YYYY-MM-DD HH:mm:ss');
				if ($routeParams.appointid) {
					Exam.obj.fk_appoint = $routeParams.appointid;
					Exam.obj.examtype = Agenda.obj.apptype;
				}
				var flexformname = Flexschema.getInitialFlexformByName('exam', 'exam_flexform');
				getFlexforms(flexformname, function(ack, msg) {
					if (!ack) {
						Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), msg);
					}
				});*/
            Graphui.setLoading(false);


		} else {
			Graphui.setLoading(false);
		}
	};
	
	/**
	 * Set the status of the tab
	 * 
	 * @param {integer} tabnumber number of the tab
	 */
	$scope.setTab = function(tabnumber) {
		if (tabnumber == 1) {
			Exam.setTab(true, false);
		}
		if (tabnumber == 2) {
			Exam.setTab(false, true);
		}
	};
	
	/**
	 * Get the status of the current tab, if selected or not
	 * 
	 */
	$scope.getTabStatus = function(tabnumber) {
		return Exam.getTabStatus(tabnumber);
	};
	
	/**
	 * Manage previous and next visits buttons
	 * 
	 */
	$scope.changeVisitButton = function(examid) {
		if (!Exam.viz.create){
			if (!examid) {
				examid = Exam.obj.id;
			}

			$scope.previousdis = Exam.getPreviousExam(examid);
			$scope.nextdis = Exam.getNextExam(examid);
		}
		return null;
	};

	$scope.changeVisitButton(null);
	
	/**
	 * Set the right tab active
	 * 
	 */
	$scope.checkTabIsActive = function(tabnumber) {
		if (Exam.getTabStatus(tabnumber)) {
			return 'active';
		} else {
			return '';
		}
	};
	
	/**
	 * Check if the exam is loaded
	 * 
	 */
	$scope.checkExamIsLoaded = function() {
		return Exam.checkExamIsLoaded() || Exam.checkCreateState();
	};
	
	/**
	 * Check if the form is enabled in the case of creation and update
	 * 
	 */
	$scope.checkFormEnabled = function() {
		return Exam.checkWriteState();
	};
	
	$scope.checkLicense = function () {
		return (User.info.trial == "P");
	};
	
	/**
	 * Check if the delete is enabled
	 * 
	 */
	$scope.checkDeleteEnabled = function() {
		if (Exam.checkWriteState()) {
			return !Exam.checkCreateState();
		} else {
			return false;
		}
	};
	
	/**
	 * Check if the form is in creation or update state 
	 * 
	 */
	$scope.checkCreationEnabled = function() {
		return Exam.checkWriteState() && Exam.checkCreateState();
	};
	
	/**
	 * Create a copy of server data and save the last flex schema name
	 * 
	 */
	$scope.enableUpdateExamDetails = function() {
		Exam.backupExam(angular.copy(Exam.obj));
		$scope.oldExamFlexName = angular.copy(Flexschema.flex.current.exam.exam_flexform);
		Exam.writeState(true);
	};
	
	/**
	 * Reload the copy of server data and reset the old flexschema
	 * 
	 */
	$scope.backExamUpdate = function() {
		//Graphui.setLoading(true);
		$scope.exam.obj = Exam.checkBackupExam();
		Flexschema.flex.current.exam.exam_flexform = $scope.oldExamFlexName;
		Flexschema.getFlexSchema("exam", $scope.oldExamFlexName, null, function(ack, msg, payload) {
			Exam.lastflexschema = payload;
		});
		Exam.writeState(false);
		$scope.showListFlexExam = false;
		// if it is the create case back to the examslist
		if (Exam.checkCreateState()) {
			$location.path('/examslist/');
		}
		//Graphui.setLoading(false);
	};
	
	/**
	 * Create or Update the exam
	 * 
	 */
	$scope.updateExamDetails = function() {
		//var msgType = User.checkLicenseFreeLimit("EXA");
		if (true) {
			if ($scope.editExamForm.$valid) {
				if (Exam.checkCreateState()) {
					Exam.createExamDetails(Patient.obj, Exam.obj.descriptionList,Exam.obj.lastmodDate, Patient.obj.id, "EXAM", function(ack, msg, newpatientid) {
						if (newpatientid) {
							// creation ok
							$location.path('/examdetail/' + newpatientid);
							// getallexamsbypatient non e neccessario
                            //Exam.getAllExamsByPatientId(Patient.obj.id, "EXAM");
						} else {
							Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), msg);
							//Graphui.setLoading(false);
						}
					});
				} else {
					Exam.updateExamDetails(function(ack, msg) {
						if (ack) {
							// update ok
							Exam.createState(false);
							Exam.writeState(false);
							Exam.getAllExamsByPatientId(Patient.obj.id, "EXAM");
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
	 * Dialog for delete an exam
	 * 
	 */
	$scope.openDialogDeleteConfirm = function() {
		Gendialog.openConfirmDialog($translate('EXAM.MSG.DELEXAMCONFIRM_TITLE'), $translate('EXAM.MSG.DELEXAMCONFIRM_QUEST'), $scope.deleteExamDetails);
	};
	
	/**
	 * Delete the exam
	 * 
	 */
	$scope.deleteExamDetails = function() {
		//Graphui.setLoading(true);
		Exam.writeState(false);
		$scope.showListFlexExam = false;
		Exam.deleteExam(Exam.obj.id, function(ack, msg) {
			if (true) {
				$location.path('/examslist/refresh/');
				Exam.clearExamObj();
			} else {
				Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), msg);
				//Graphui.setLoading(false);
			}
		});
	};
	
	$scope.printExamDetails = function() {
		Exam.printExamDetails(Exam.obj.id);
	};
	
	$scope.setShowListFlexExam = function() {
		if (User.getLicenseName() === "PRO") {
			$scope.showListFlexExam = true;
		} else {
			$scope.showListFlexExam = false;
			Gendialog.openErrorLicenseFreeDialog("PRO");
		}
	};
	
	$scope.updateUseroptsFlexforms = function(flexname) {
		Flexschema.getFlexSchema("exam", flexname, null, function(ack, msg, payload) {
			Exam.obj.jsondata = {};
			Flexschema.flex.current.exam.exam_flexform = flexname;
			Exam.lastflexschema = payload;
		});
	};

	/**
	 * Create new invoice for the current exam
	 * 
	 */
	$scope.openCreateNewInvoice = function() {
		$location.path('/invoicecreate/' + Patient.obj.id + '/' + Exam.obj.id);
	};
	
	/**
	 * Get previous visit
	 * 
	 */
	$scope.previousVisit = function() {
		$scope.savetab1 = Exam.getTabStatus(1);
		$scope.savetab2 = Exam.getTabStatus(2);
		var prevexamid = Exam.getPreviousExam(Exam.obj.id);
		if (prevexamid) {
			//Graphui.setLoading(true);
			Exam.getExamDetails(prevexamid, function() {
				Exam.setTab($scope.savetab1, $scope.savetab2);
				//Graphui.setLoading(false);
			});
		}
		$scope.changeVisitButton(prevexamid);
	};
	
	/**
	 * Get next visit
	 * 
	 */
	$scope.nextVisit = function() {
		$scope.savetab1 = Exam.getTabStatus(1);
		$scope.savetab2 = Exam.getTabStatus(2);
		var nextexamid = Exam.getNextExam(Exam.obj.id);
		if (nextexamid) {
			//Graphui.setLoading(true);
			Exam.getExamDetails(nextexamid, function() {
				Exam.setTab($scope.savetab1, $scope.savetab2);
				//Graphui.setLoading(false);
			});
		}
		$scope.changeVisitButton(nextexamid);
	};
	
	/**
	 * Get appoint type object
	 * 
	 * @param {string} typecode exam type code
	 */
	$scope.getExamTypeObj = function(typecode) {
		var typeobj = User.getAppointTypeData(typecode);
		if (typeobj) {
			return typeobj;
		} else {
			return null;
		}
	};
	
	/**
	 * Change exam type
	 * 
	 * @param {string} typecode exam type code
	 */
	$scope.changeExamType = function(typecode) {
		Exam.updateExamType(Exam.obj.id, typecode, function(ack, msg) {
			if (!ack) {
				Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), msg);
			} else {
				Exam.obj.examtype = typecode;
				Exam.getAllExamsByPatientId(Patient.obj.id, "EXAM");
			}
		});
	};

	/**
	 *
	 */
	$scope.setShowListFlexExam = function() {
		if (User.getLicenseName() === "PRO") {
			$scope.showListFlexExam = true;
		} else {
			$scope.showListFlexExam = false;
			Gendialog.openErrorLicenseFreeDialog("PRO");
		}
	};

	// executed from the route
	Graphui.setLoading(true);
	Navbar.setTabSelected('exam');
	$scope.refreshExamDetails();
}