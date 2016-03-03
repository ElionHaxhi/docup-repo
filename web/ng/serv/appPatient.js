var appPatient = angular.module('appPatient', [
	'ngCookies'
]);

appPatient.factory('Patient', 
	[
		'$http', 
		'$location', 
		'$translate', 
		'$analytics',
		'$cookieStore', 
		'App', 
		'Config', 
		'User',
		'LoginAuthentication', 
		'Gendialog', 
		'Flexschema', 
		'Flexmodel', 
		'Annotation', 
		'Attach', 
		'Service', 
		'Exam', 
		'Measure',
	function (
		$http, 
		$location, 
		$translate, 
		$analytics,
		$cookieStore, 
		App, 
		Config, 
		User, 
		LoginAuthentication, 
		Gendialog, 
		Flexschema, 
		Flexmodel, 
		Annotation, 
		Attach, 
		Service, 
		Exam, 
		Measure ) {
	
	
	var patient = {
		warninglist: [],
		list: null,
		vp: "",
		obj: {
			jsondata: {},
			jsonpatient: {}
		},
		stats: {
			age: null
		},
		backup: null,
		filter: {
			pattype: null
		},
		viz: {
			write: false,	//apre pagina in lettura o scrittura
			create: false,	//apre pagina per creare o modificare un paziente
			tab0: true,
			tab1: false,
			tab2: false,
			tab3: false,
			serviceIsOpen: false,
			serviceIsFullHeight: true,
			annotationIsOpen: false,
			annotationIsFullHeight: true,
			attachIsOpen: false,
			attachIsFullHeight: true,
			graphIsOpen: false,
			graphIsFullHeight: true,
			docsignIsOpen: false,
			docsignIsFullHeight: true
		},
		lastflexschema:  null,
		lastfixform:  null
	};
	patient.login=LoginAuthentication.getLogin();
	
	/**
	 * Read or write state of the view patient
	 * 
	 */
	patient.writeState = function(state) {
		patient.viz.write = state;
		return true;
	};
	
	/**
	 * Create or update state of the view patient
	 * 
	 */
	patient.createState = function(state) {
		patient.viz.create = state;
		return true;
	};
	
	/**
	 * Modify tab state
	 * 
	 */
	patient.setTab = function(tab0, tab1, tab2, tab3) {
		patient.viz.tab0 = tab0;
		patient.viz.tab1 = tab1;
		patient.viz.tab2 = tab2;
		patient.viz.tab3 = tab3;
	};
	
	/**
	 * Get tab state
	 * 
	 * @param tabnumber number of the tab to be checked
	 */
	patient.getTabStatus = function(tabnumber) {
		var retTab = null;

		if (tabnumber == '0') {
			retTab = patient.viz.tab0;
		}
		if (tabnumber == '1') {
			retTab = patient.viz.tab1;
		}
		if (tabnumber == '2') {
			retTab = patient.viz.tab2;
		}
		if (tabnumber == '3') {
			retTab = patient.viz.tab3;
		}

		return retTab;
	};
	
	/**
	 * Close all sections
	 * 
	 */
	patient.closeAllSections = function() {
		patient.viz.serviceIsOpen = false;
		patient.viz.annotationIsOpen = false;
		patient.viz.attachIsOpen = false;
		patient.viz.graphIsOpen = false;
		patient.viz.docsignIsOpen = false;
	};
	
	/**
	 * Toggle a section
	 * 
	 */
	patient.toggleSection = function(sectionName) {
		if (patient.viz[sectionName]) {
			patient.viz[sectionName] = false;
		} else {
			patient.closeAllSections();
			patient.viz[sectionName] = true;
		}
	};
	
	/**
	 * Toggle full height to section
	 * 
	 */
	patient.toggleFullHeight = function(sectionName, cssName) {
		if (patient.viz[sectionName]) {
			patient.viz[sectionName] = false;
			$(cssName).height('50%');
		} else {
			patient.viz[sectionName] = true;
			$(cssName).height('100%');
		}
	};
	
	/**
	 * Save the old data of patient
	 * 
	 */
	patient.backupPatient = function() {
		patient.backup = angular.copy(patient.obj);
		return true;
	};
	
	/**
	 * Return the old data of patient
	 * 
	 */
	patient.revertBackupPatient = function() {
		patient.obj = angular.copy(patient.backup);
		patient.bakcup = null;
	};
	
	/**
	 * Return read or write state of the view patient
	 * 
	 */
	patient.checkWriteState = function() {
		return patient.viz.write;
	};
	
	/**
	 * Return create or Update state of the view patient
	 * 
	 */
	patient.checkCreateState = function() {
		return patient.viz.create;
	};
	
	/**
	 * Delete checkPatientIsLoaded
	 * 
	 * @return booelan true if a patient is loaded
	 */
	patient.checkPatientIsLoaded = function() {
		return (!_.isEmpty(patient) && !_.isEmpty(patient.obj) && !_.isEmpty(patient.vp));

	};

	patient.checkLoginIsLoaded = function() {
        return (!_.isEmpty(patient) && !_.isEmpty(patient.login) && !_.isEmpty(patient.login.id));
    };
	
	/**
	 * Clear patient object
	 * 
	 * @return booelan true after patient is cleared
	 */
	patient.clearPatientObj = function() {
		patient.obj = {
			jsondata: {},
			jsonpatient: {}
		};
		return true;
	};


	/**
	 * Get all patients list
	 * 
	 * @param {function} callback
	 */
	patient.getAllPatients = function(callback) {
		var cook = App.getOldCookies().get('globals');
        Exam.clearExamsList();
		patient.objectClone = patient.login.getLogin();
		if(!cook){
				var xsrf = $.param({
					filterpattype: patient.filter.pattype
				});
				$http({
				    method: 'GET',
				    url:  Config.base_url + 'ws/p/' + patient.login.getLogin().id
				}).
				success(function(data) {
					//App.checkUserSession(data);
				console.log('success on list');
					
						var patientList = [];
						_.each(data, function(patient){
							patient.fullname = patient.personalInfoId.name + " " + patient.personalInfoId.surname;
                            patient.date = App.transformDate(patient.date);
							patientList.push(patient);
							
						});

						//ripristino il tab dei singoli pazienti
						patient.vp = "";
						patient.list = patientList;

						/*
							questo callback avisa la ricezione dei dati e invia un token al
							ctrlPatientlist per disativare il ui grafic
						*/
						if (_.isFunction(callback)) callback(true, null, data);
					
				}).error(function() {
					if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
				});
		}
		else{
			var xsrf = $.param({
			filterpattype: patient.filter.pattype
		});
		$http({
		    method: 'GET',
		    url:  Config.base_url +'/ws/p/'+cook.currentUser.id
		}).
		success(function(data) {
			//App.checkUserSession(data);
		console.log('success on list');
			
				//ripristino il tab di singolo pasiente caso quando non ho cookie.
				patient.vp = "";
			
				var patientList = [];
				_.each(data, function(patient){
					patient.fullname = patient.personalInfoId.name + " " + patient.personalInfoId.surname;
                    patient.date = App.transformDate(patient.date);
                    patientList.push(patient);
					
				});
				patient.list = patientList;

				/*
					questo callback avisa la ricezione dei dati e invia un token al
					ctrlPatientlist per disativare il ui grafic
				*/
				if (_.isFunction(callback)) callback(true, null, data);

			
		}).error(function() {
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
		}
	};
	
	/**
	 * Get patient details from the current list of patients
	 * 
	 * @param {string} patientid patient id
	 */
	patient.getPatientFromList = function(patientid) {
		return _.findWhere(patient.list, {id: patientid});
	};
	
	/**
	 * Get patient details
	 * 
	 * @param {string} patientid patient id
	 * @param {function} callback
	 */
	patient.getPatientDetails = function(patientid, callback) {
		patient.viz.write = false;
		patient.viz.create = false;
		patient.viz.tab0 = true;
		patient.viz.tab1 = false;
		patient.viz.tab2 = false;
		patient.viz.tab3 = false;

		/*var xsrf = $.param({
			id: patientid
		});*/
		$http({
		    method: 'GET',
		    url:  Config.base_url +'/ws/p/get/'+patientid,
		    headers: {'Content-Type': 'application/json'}
		}).
		success(function(data) {
			App.checkUserSession(data);
			if (data) {
				// prepare patient object
				patient.clearPatientObj();
				patient.vp = "okoravisualizapatienttab"
				
				/*
				if (!_.isObject(data.payload.jsondata)) {
					data.payload.jsondata = {};
				}
				if (!_.isObject(data.payload.jsonpatient)) {
					data.payload.jsonpatient = {};
				}
				*/
				
				patient.obj = angular.copy(data);
				// prepare patient stats
				/*patient.stats.age = null;
				if (data.payload.borndate) {
					var today = moment();
					var bornmoment = moment(data.payload.borndate);
					patient.stats.age = today.diff(bornmoment, 'years');
				}*/

				// get warning list from flexschema
				/*patient.warninglist = [];
				if(data.payload.jsondata_type){
					Flexschema.getFlexSchema("patient", data.payload.jsondata_type, null, function(ack, msg, flexform){
						Flexmodel.setFlexProperties(flexform.schema.properties);
						Flexmodel.setFlexModel(data.payload.jsondata);

						patient.warninglist = Flexmodel.getWarnings();
					});
				}*/

				// prepare viz
				patient.createState(false);
				patient.writeState(false);
				Exam.createState(false);
				Exam.writeState(false);

				// once the patient is ready call the callback if present
				if (_.isFunction(callback)) callback(true, null, data);

				// clear all the related data
				/*
				Annotation.clearAnnotationObj('patient');
				Service.clearAvaserviceObj();
				Service.clearSelserviceObj('patient');
				Attach.clearAttachObj(null);
				Exam.clearExamsList();
				Exam.viz.navDetail = false;
				Measure.clearRecordList();
				Measure.viz.navDetail = false;
				*/
				// get in background related information
				/*
				Annotation.getAllAnnotations(patientid, 'patient', null);
				Service.getAllAvailableServices();
				Service.getAllServices('patient', patientid);
				Attach.getAllAttachsList(patientid, null);
				*/
				// preload exams list
				//Exam.getAllExamsByPatientId(patientid, "EXAM", null);
			} else {
				if (_.isFunction(callback)) callback(false, data.message, null);
			}
		}).error(function() {
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	
	/**
	 * Create new patient
	 * 
	 * @param {function} callback
	 */
	patient.createPatientDetails = function(callback) {
		
/*
	Qui semplicemente preparo un clone adato per l'inserimento di un nuovo paziente
	in base alle richieste del metoto post
*/
		var temp = angular.copy(patient.obj);
		var saveobj = {};
		saveobj.personalInfoId = temp.personalInfoId;
		saveobj.id = -1;
		saveobj.date = Date.now();
		saveobj.trash = false;
		saveobj.trashDate = null;
		saveobj.personalInfoId.id = -1;

		var pictureId = {
			id: 1,
			filename: "default.jpg"
		};
		saveobj.pictureId = pictureId;

		var doctorList = [];
		doctorList.push(patient.objectClone);
		saveobj.doctorList = doctorList;
		/*if (_.isEmpty(saveobj.jsondata)) {
			saveobj.jsondata = null;
		} else {
			saveobj.jsondata = JSON.stringify(saveobj.jsondata);
		}
		if (_.isEmpty(saveobj.jsonpatient)) {
			saveobj.jsonpatient = null;
		} else {
			saveobj.jsonpatient = JSON.stringify(saveobj.jsonpatient);
		}*/
		//saveobj.jsondata_type = Flexschema.flex.current.patient.patient_flexform;
		
		var xsrf = $.param(saveobj);
		$http({
		    method: 'POST',
		    url:  Config.base_url + '/ws/p',
		    data: saveobj,
		    headers: {'Content-Type': 'application/json'}
		}).
		success(function(data) {
			//App.checkUserSession(data);
			if (data) {
				//$analytics.eventTrack('PatientEdit', {  type: 'create', flex: saveobj.jsondata_type });

				if (_.isFunction(callback)) callback(true, null, data.id);
			} else {
				if (_.isFunction(callback)) callback(false, data.message, null);
			}
		}).error(function() {
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	
	/**
	 * Update patient
	 * 
	 * @param {function} callback
	 */
	patient.updatePatientDetails = function(callback) {
		var saveobj = angular.copy(patient.obj);
		/*if (_.isEmpty(saveobj.jsondata)) {
			saveobj.jsondata = null;
		} else {
			saveobj.jsondata = JSON.stringify(saveobj.jsondata);
		}
		if (_.isEmpty(saveobj.jsonpatient)) {
			saveobj.jsonpatient = null;
		} else {
			saveobj.jsonpatient = JSON.stringify(saveobj.jsonpatient);
		}
		saveobj.jsondata_type = Flexschema.flex.current.patient.patient_flexform;

		// get warning list from flexschema
		patient.warninglist = [];
		if(saveobj.jsondata_type){
			Flexschema.getFlexSchema("patient", saveobj.jsondata_type, null, function(ack, msg, flexform){
				Flexmodel.setFlexProperties(flexform.schema.properties);
				Flexmodel.setFlexModel(JSON.parse(saveobj.jsondata));
				patient.warninglist = Flexmodel.getWarnings();
			});
		}*/

		var xsrf = $.param(saveobj);
		$http({
		    method: 'POST',
		    url:  Config.base_url +'/ws/p',
		    data: saveobj,
		    headers: {'Content-Type': 'application/json'}
		}).
		success(function(data) {
			//App.checkUserSession(data);
			if (data) {
				if (_.isFunction(callback)) callback(true, null, data);
			} else {
				if (_.isFunction(callback)) callback(false, data.message, null);
			}
		}).error(function() {
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	
	/**
	 * Update patient type
	 * 
	 * @param {string} patientid patient id
	 * @param {string} patienttype patient type code
	 * @param {function} callback
	 */
	patient.updatePatientType = function(patientid, patienttype, callback) {
		var xsrf = $.param({
			id: patientid,
			type: patienttype
		});
		$http({
		    method: 'POST',
		    url:  Config.base_url + Config.api_version + '/patients/updateType',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data) {
			App.checkUserSession(data);
			if (data.ack) {
				if (_.isFunction(callback)) callback(true, null, data.payload);
			} else {
				if (_.isFunction(callback)) callback(false, data.message, null);
			}
		}).error(function() {
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	
	/**
	 * Delete patient
	 * 
	 * @param {string} patientid patient id
	 * @param {function} callback
	 */
	patient.deletePatient = function(patientid, callback) {
		var xsrf = $.param({
			id: patientid
		});
		$http({
		    method: 'DELETE',
		    url:  Config.base_url +'/ws/p/' + patientid
		}).
		success(function(data) {
			data = "ok";
			//App.checkUserSession(data);
			if (data) {
				if (_.isFunction(callback)) callback(true, null, data);
			} else {
				if (_.isFunction(callback)) callback(false, data.message, null);
			}
		}).error(function() {
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	
	/**
	 * Get an html string with the print of the patient
	 * 
	 * @param {string} patientid patient id
	 */
	patient.printPatientDetails = function(patientid) {
		var xsrf = $.param({
			id: patientid
		});
		$http({
		    method: 'POST',
		    url:  Config.base_url + Config.api_version + '/patients/printDetails',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data) {
			App.checkUserSession(data);
			if (data.ack) {
				var newwin =  window.open('','','');
			    newwin.document.open();
			    newwin.document.write(data.payload);
			    newwin.document.close();
			} else {
				Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), $translate('GENERAL.ERR.PRINTFAIL'));
			}
		}).error(function() {
			Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), $translate('GENERAL.ERR.SERVERFAIL'));
		});
	};
	
	return patient;
}]);
