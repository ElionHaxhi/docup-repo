var appExam = angular.module('appExam', []);

appExam.factory('Exam', ['$http', '$location', '$translate', '$analytics', 'App', 'Config', 'Gendialog', 'User', 'Flexschema', 'Flexmodel', 'Graphui', 'Annotation', 'Service', 'Attach',
	function($http, $location, $translate, $analytics, App, Config, Gendialog, User, Flexschema, Flexmodel, Graphui, Annotation, Service, Attach) {

    var descriptionList = [];
        descriptionList[0] = {
            "id":-1,
            "content":"",
            "type":{
                "id":3,
                "name":"Terapia"
            }
        };
        descriptionList[1] = {
            "id":-1,
            "content":"",
            "type":{
                "id":1,
                "name":"Anamnesi"
            }
        };
        descriptionList[2] = {
            "id":-1,
            "content":"",
            "type":{
                "id":2,
                "name":"Esame obiettivo"
            }
        };
        descriptionList[3] = {
            "id":-1,
            "content":"",
            "type":{
                "id":4,
                "name":"Diagnosi"
            }
        };


	var exam = {
		episodelist: [],
		list: [],
		obj: {descriptionList:descriptionList},
		patientid: null,
		backup: null,
		filter: {
			examtype: null,
			creationDate: null,
			valtype: null
		},
		viz: {
			write: false,					// apre pagina in lettura o scrittura
			create: false,					// apre pagina per creare o modificare un paziente
			tab1: true,						// selezionato primo tab
			tab2: false,					// selezionato primo tab
			serviceIsOpen: false,			// subcsection services open
			serviceIsFullHeight: true,		// subcsection services full height
			annotationIsOpen: false,		// subcsection annotations open
			annotationIsFullHeight: true,	// subcsection annotations full height
			attachIsOpen: false,			// subcsection attachments open
			attachIsFullHeight: true,		// subcsection attachments full height
			docsignIsOpen: false,			// subcsection docsign full height
			docsignIsFullHeight: true,		// subcsection docsign full height
			navDetail: false
		},
		lastflexschema:  null
	};

	exam.writeState = function(state) {
		exam.viz.write = state;
		return true;
	};

	exam.createState = function(state) {
		exam.viz.create = state;
		return true;
	};

	exam.setTab = function(tab1, tab2) {
		exam.viz.tab1 = tab1;
		exam.viz.tab2 = tab2;
	};

	exam.backupExam = function(copy) {
		exam.backup = copy;
		return true;
	};

	exam.checkWriteState = function() {
		return exam.viz.write;
	};

	exam.checkCreateState = function() {
		return exam.viz.create;
	};

	exam.getTabStatus = function(tabnumber) {
		if (tabnumber == 1) {
			return exam.viz.tab1;
		}
		else if (tabnumber == 2) {
			return exam.viz.tab2;
		}
		else{
			return null;
		}
	};

	/**
	 * Close all sections
	 *
	 */
	exam.closeAllSections = function() {
		exam.viz.serviceIsOpen = false;
		exam.viz.annotationIsOpen = false;
		exam.viz.attachIsOpen = false;
		exam.viz.docsignIsOpen = false;
	};

	/**
	 * Toggle a section
	 *
	 */
	exam.toggleSection = function(sectionName) {
		if (exam.viz[sectionName]) {
			exam.viz[sectionName] = false;
		} else {
			exam.closeAllSections();
			exam.viz[sectionName] = true;
		}
	};

	/**
	 * Toggle full height to section
	 *
	 */
	exam.toggleFullHeight = function(sectionName, cssName) {
		if (exam.viz[sectionName]) {
			exam.viz[sectionName] = false;
			$(cssName).height('50%');
		} else {
			exam.viz[sectionName] = true;
			$(cssName).height('100%');
		}
	};

	/**
	 * Check if an exam backup is setup
	 *
	 */
	exam.checkBackupExam = function() {
		return exam.backup;
	};

	/**
	 * Check if an exam is loaded
	 *
	 */
	exam.checkExamIsLoaded = function() {
		return (!_.isEmpty(exam) && !_.isEmpty(exam.obj) && !_.isEmpty(exam.obj.id));
	};

	/**
	 * Clear exam list data
	 *
	 */
	exam.clearExamsList = function() {
		exam.episodelist = [];
		exam.list = [];
        exam.viz.navDetail = false;
	};

	/**
	 * Clear exam data
	 *
	 */
	exam.clearExamObj = function() {
		exam.obj = {
            descriptionList:descriptionList
		};
	};

	/**
	 * Get all active exams for the user
	 *
	 * @param {string} patientid
	 * @param {string} rectype
	 * @param {function} callback
	 */
/*	exam.getAllExamsByPatientId = function(patientid, rectype, callback) {
		var xsrf = $.param({
			patientid: patientid,
			rectype: rectype,
			filtertype: exam.filter.examtype
		});
		$http({
			method: 'POST',
			url:  Config.base_url + Config.api_version + '/exams/getAll',
			data: xsrf,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data) {
			App.checkUserSession(data);
			if (data.ack) {
				exam.list = data.payload;

				User.counters.exam = _.size(data.payload);
				exam.episodelist = [];
				_.each(exam.list, function(elem) {
					// manage the complete list of episodes
					if (elem.episodeid) {
						var newepisodeforlist = {};
						newepisodeforlist.episodeid = elem.episodeid;
						newepisodeforlist.episodedescr = elem.episodedescr;
						// check if the episode is already in the complete list
						var episodecheck = _.find(exam.episodelist, function(obj) {
							return _.isEqual(newepisodeforlist, obj);
						});
						// add episode to the complete list if not present
						if (!episodecheck) {
							exam.episodelist.push(newepisodeforlist);
							elem.vizepisode = true;
						} else {
							elem.vizepisode = false;
						}
					} else {
						elem.vizepisode = false;
					}

					Flexschema.getFlexSchema("exam", elem.jsondata_type, null, function(ack, msg, flexform){
						if(flexform){
							Flexmodel.setFlexProperties(flexform.schema.properties);
							Flexmodel.setFlexModel(JSON.parse(elem.jsondata));

							elem.warninglist = Flexmodel.getWarnings();
						}
					});
				});

				// call the callback if present
				if (_.isFunction(callback)) callback(true, null, data.payload);
			} else {
				exam.list = [];
				exam.episodelist = [];
				if (_.isFunction(callback)) callback(false, $translate('EXAM.ERR.GETEXAMSFAIL'), null);
			}
		}).error(function() {
			exam.list = [];
			exam.episodelist = [];
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
*/
////////////////////////////////////Elion//////////////////////////////////////////////////////////////////////

/**
	 * Get all active exams for the user
	 *
	 * @param {string} patientid
	 * @param {string} rectype
	 * @param {function} callback
	 */
	exam.getAllExamsByPatientId = function(patientid, rectype, callback) {
		var xsrf = $.param({
			patientid: patientid,
			rectype: rectype,
			filtertype: exam.filter.examtype
		});
		$http({
			method: 'GET',
			url:  Config.base_url +'/ws/vs/'+ patientid
			//data: xsrf,
			//headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function(data) {
			//App.checkUserSession(data);
			if (data) {
				exam.list = data;

				//User.counters.exam = _.size(data.payload);
				exam.episodelist = [];
				_.each(exam.list, function(elem) {
					// manage the complete list of episodes

                    elem.descriptionList.sort(function(a, b){return a.type.id- b.type.id});
                    elem.diagnosi = elem.descriptionList[3].content;


						elem.creationDate = App.transformDateTime(elem.creationDate);



					/*if (elem.episodeid) {
						var newepisodeforlist = {};
						newepisodeforlist.episodeid = elem.episodeid;
						newepisodeforlist.episodedescr = elem.episodedescr;
						// check if the episode is already in the complete list
						var episodecheck = _.find(exam.episodelist, function(obj) {
							return _.isEqual(newepisodeforlist, obj);
						});
						// add episode to the complete list if not present
						if (!episodecheck) {
							exam.episodelist.push(newepisodeforlist);
							elem.vizepisode = true;
						} else {
							elem.vizepisode = false;
						}
					} else {
						elem.vizepisode = false;
					}*/

					/*Flexschema.getFlexSchema("exam", elem.jsondata_type, null, function(ack, msg, flexform){
						if(flexform){
							Flexmodel.setFlexProperties(flexform.schema.properties);
							Flexmodel.setFlexModel(JSON.parse(elem.jsondata));

							elem.warninglist = Flexmodel.getWarnings();
						}
					});*/
				});

				// call the callback if present
				if (_.isFunction(callback)) callback(true, null, data);
			} else {
				exam.list = [];
				exam.episodelist = [];
				if (_.isFunction(callback)) callback(false, $translate('EXAM.ERR.GETEXAMSFAIL'), null);
			}
		}).error(function() {
			exam.list = [];
			exam.episodelist = [];
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	//////////////////////////////////////////////////////////////////////////7

/////////////////////////////////////////Elion///////////////////////////////////////////////////

    exam.getExamDetails = function(examid, callback){

        exam.viz.write = false;
        exam.viz.create = false;
        exam.viz.tab1 = true;
        exam.viz.tab2 = false;



        exam.clearExamObj();


        $http({
            method: 'GET',
            url: Config.base_url + '/ws/vs/get/'+examid,
            //data: xsrf,
            headers: {'Content-Type': 'application/json'}
        }).
        success(function(data) {

                /*
                 questa funzione mi permette di fare un semplice sort in base allo type di visita
                 in questo modo c'è li ho ordinati
                 */
                data.descriptionList.sort(function(a, b){return a.type.id- b.type.id});

                exam.obj=data;
                exam.obj.lastmodDate  = App.transformDateTime(data.lastmodDate);

                exam.createState(false);
                exam.writeState(false);

                if (_.isFunction(callback)) callback(true, null,data);

            }).error(function() {
                if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
        });

    };

////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Get all details for an exam
	 *
	 * @param {string} examid
	 * @param {function} callback [optional]
	 */
    /*
	exam.getExamDetails = function(examid, callback) {
		exam.viz.write = false;
		exam.viz.create = false;
		exam.viz.tab1 = true;
		exam.viz.tab2 = false;
		var xsrf = $.param({
			id: examid
		});
		$http({
			method: 'POST',
			url: Config.base_url + Config.api_version + '/exams/get',
			data: xsrf,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data) {
			App.checkUserSession(data);
			if (data.ack && data.payload) {
				// prepare exam object
				exam.clearExamObj();
				if (!_.isObject(data.payload.jsondata)) {
					data.payload.jsondata = {};
				}
				exam.obj = angular.copy(data.payload);
				// set info for flexform of the exam
				if (exam.obj.jsondata_type) {
					exam.obj.flexformname = Flexschema.getFlexformDescrFromDbname(exam.obj.jsondata_type);
				}
				// prepare viz
				exam.createState(false);
				exam.writeState(false);
				// once the patient is ready call the callback if present
				if (_.isFunction(callback)) callback(true, null, data.payload);
				// clear all the related data
				Annotation.clearAnnotationObj('exam');
				Service.clearAvaserviceObj();
				Service.clearSelserviceObj('exam');
				Attach.clearAttachObj();
				// get in background related information
				Annotation.getAllAnnotations(examid, 'exam');
				Service.getAllAvailableServices();
				Service.getAllServices('exam', examid);
				Attach.getAllAttachsList(exam.obj.fk_patient, exam.obj.id);
			} else {
				if (_.isFunction(callback)) callback(false, $translate('EXAM.ERR.GETEXAMFAIL'), null);
			}
		}).error(function() {
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};*/

	/**
	 * Get the last exam to populate the new exam form
	 *
	 * @param {string} type exam type
	 * @param {string} patientid
	 * @param {function} callback [optional] callback function
	 */
	exam.getLastExamByType = function(patientid, callback) {
		exam.viz.tab1 = true;
		exam.viz.tab2 = false;
		var xsrf = $.param({
			examtype: Flexschema.getCurrentFlexformByName("exam", "exam_flexform"),
			rectype: "EXAM",
			patientid: patientid
		});
		$http({
			method: 'POST',
			url: Config.base_url + Config.api_version + '/exams/getLast',
			data: xsrf,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data) {
			App.checkUserSession(data);
			if (data.ack) {
				exam.clearExamObj();
				if (!_.isObject(data.payload.jsondata)) {
					data.payload.jsondata = {};
				}

				exam.obj = angular.copy(data.payload);
				if (_.isFunction(callback)) callback(true, null, data.payload);
			} else {
				exam.obj.jsondata = {};
				if (_.isFunction(callback)) callback(false, $translate('EXAM.ERR.GETEXAMFAIL'), null);
			}
		}).error(function() {
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};

	/**
	 * Create new exam with the data in the model
	 *
	 * @param {string} patientid
	 * @param {string} rectype
	 * @param {function} callback
	 */
	exam.createExamDetails = function(patientcloneobject,descriptionList, lastmodDate, patientid, rectype, callback) {
		//var saveobj = angular.copy(exam.obj);



        var saveobj ={};
        saveobj.id = -1;
        saveobj.creationDate = Date.now();
        // qui converto la data in long cosi riesco ad inserirlo nel database
        saveobj.lastmodDate = Date.parse(lastmodDate);
        saveobj.trash = false;
        saveobj.trashDate = null;

        saveobj.descriptionList = descriptionList;
        saveobj.patientId = patientcloneobject;
        saveobj.pictureId = {
                "id": 2,
                "filename": "default.jpg"
        };

		var xsrf = $.param(saveobj);
		$http({
			method: 'POST',
			url: Config.base_url + '/ws/vs',
			data: saveobj,
			headers: {'Content-Type': 'application/json'}
		}).
		success(function(data) {
			//App.checkUserSession(data);
                data.creationDate = App.transformDateTime(data.creationDate);
			if (data) {
				//$analytics.eventTrack('ExamEdit', {  type: 'create', flex: saveobj.jsondata_type });

				if (_.isFunction(callback)) callback(true, null, data.id);
			} else {
				if (_.isFunction(callback)) callback(false, data.message, null);
			}
		}).error(function() {
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};

	/**
	 * Update exam with the data in the model
	 *
	 * @param {function} callback
	 */
	exam.updateExamDetails = function(callback) {
		var saveobj = angular.copy(exam.obj);



        //riconverto la data in long
        saveobj.creationDate = Date.parse(saveobj.creationDate);
        saveobj.lastmodDate = Date.parse(saveobj.lastmodDate);



        $http({
			method: 'PUT',
            //l'uno non sevre ma e neccesario un input ,devo modificare il restful di visitresource
			url: Config.base_url  + '/ws/vs/1',
			data: saveobj,
			headers: {'Content-Type': 'application/json'}
		}).
		success(function(data) {
                data.creationDate = App.transformDateTime(data.creationDate);
                data.lastmodDate = App.transformDateTime(data.lastmodDate);
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
	 * Update exam type
	 *
	 * @param {string} id exam id
	 * @param {string} examtype exam type code
	 * @param {function} callback callback function
	 */
	exam.updateExamType = function(id, examtype, callback) {
		var xsrf = $.param({
			id: id,
			type: examtype
		});
		$http({
			method: 'POST',
			url: Config.base_url + Config.api_version + '/exams/updateType',
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
	 * Delete exam
	 *
	 * @param id unique exam id
	 * @param callback
	 */
	exam.deleteExam = function(id, callback) {
		var xsrf = $.param({
			id: id
		});
		$http({
			method: 'DELETE',
			url: Config.base_url +'/ws/vs/' + id
			//data: xsrf,
			//headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data) {
			//App.checkUserSession(data);
			if (true) {
				if (_.isFunction(callback)) callback(true, null,null);
			} else {
				if (_.isFunction(callback)) callback(false, data.message, null);
			}
		}).error(function() {
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};

	/**
	 * Open new page with exam print
	 *
	 * @param {string} id exam id
	 */
	exam.printExamDetails = function(id) {
		var xsrf = $.param({
			id: id
		});
		$http({
			method: 'POST',
			url: Config.base_url + Config.api_version + '/exams/printDetails',
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

	/**
	 * Get previous exam id
	 *
	 * @param {string} id current exam id
	 */
	exam.getPreviousExam = function(id) {
		if (exam.list) {
			for (var i = 0; i < exam.list.length; i++) {
				if (exam.list[i].id == id) {
					if (exam.list[i+1] && exam.list[i+1].id) {
						return exam.list[i+1].id;
					} else {
						return false;
					}
				}
			}
		} else {
			return false;
		}
		return false;
	};

	/**
	 * Get next exam id
	 *
	 * @param {string} id current exam id
	 */
	exam.getNextExam = function(id) {
		if (exam.list) {
			for (var i = 0; i < exam.list.length; i++) {
				if (exam.list[i].id == id) {
					if (exam.list[i-1] && exam.list[i-1].id) {
						return exam.list[i-1].id;
					} else {
						return false;
					}
				}
			}
		} else {
			return false;
		}
		return false;
	};

	/*
	 * EPISODE FUNCS
	 */

	/**
	 * Create new episode
	 *
	 * @param {string} patientid
	 * @param {string} examid
	 * @param {object} episode object with examid, episode description and episode note
	 * @param {function} callback
	 */
	exam.createEpisode = function(patientid, examid, episode, callback) {
		var xsrf = $.param({
			patientid: patientid,
			examid: examid,
			descr: episode.descr,
			note: episode.note
		});
		$http({
			method: 'POST',
			url: Config.base_url + Config.api_version + '/episodes/create',
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
	 * Update existing episode
	 *
	 * @param {object} episode object with episodeid, episode description and episode note
	 * @param {function} callback
	 */
	exam.updateEpisode = function(episode, callback) {
		var xsrf = $.param({
			id: episode.id,
			descr: episode.descr,
			note: episode.note
		});
		$http({
			method: 'POST',
			url: Config.base_url + Config.api_version + '/episodes/update',
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
	 * Assign exam to episode
	 *
	 * @param {string} episodeid unique episode id
	 * @param {string} examid unique exam id
	 * @param {function} callback
	 */
	exam.assignEpisode = function(episodeid, examid, callback) {
		var xsrf = $.param({
			examid: examid,
			episodeid: episodeid
		});
		$http({
			method: 'POST',
			url: Config.base_url + Config.api_version + '/episodes/assign',
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
	 * Remove exam from episode
	 *
	 * @param {string} examid unique exam id
	 * @param {function} callback
	 */
	exam.deassignExamFromEpisode = function(examid, callback) {
		var xsrf = $.param({
			examid: examid
		});
		$http({
			method: 'POST',
			url: Config.base_url + Config.api_version + '/episodes/deassign',
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
	 * Delete episode
	 *
	 * @param {string} episodeid unique episode id
	 * @param {function} callback
	 */
	exam.deleteEpisode = function(episodeid, callback) {
		var xsrf = $.param({
			id: episodeid
		});
		$http({
			method: 'POST',
			url: Config.base_url + Config.api_version + '/episodes/delete',
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

	return exam;
}]);
