var appDocsign = angular.module('appDocsign', []);

appDocsign.factory('Docsign', ['$http', '$translate', '$analytics', 'App', 'Config', 'Gendialog', 'User', 'Patient', 'Exam',
	function($http, $translate, $analytics, App, Config, Gendialog, User, Patient, Exam) {
	
	var docsign = {
		patient: {
			list: null,
			obj: null,
			backup: null,
			doc: null,
			docName: null
		},
		exam: {
			list: null,
			obj: null,
			backup: null,
			doc: null,
			docName: null
		}
	};
	
	/**
	 * Download a docsign file from server
	 * 
	 * @param type 
	 * @param string filename name of the docsign file
	 * @param function callback
	 */
	docsign.getFlexSchemaFromServer = function(type, filename, callback) {
		// 
		var patientid = null;
		var examid = null;
		if (type == 'patient') {
			patientid = Patient.obj.id;
		}
		if (type == 'exam') {
			patientid = Patient.obj.id;
			examid = Exam.obj.id;
		}
		// prepare message
		var xsrf = $.param({
			filename: filename,
			patientid: patientid,
			examid: examid
		});
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/docsigns/getDocsignFile',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data, status, headers, config) {
			if (data.ack) {
				docsign[type].doc = data.payload;
				docsign[type].docName = filename;
				callback(true, null, data.payload);
			} else {
				callback(false, data.message, null);
			}
		}).error(function(data, status, headers, config) {
			callback(false, $translate('SERVERFAIL'), null);
		});
	};
	
	/**
	 * Save the object
	 * 
	 */
	docsign.backupDocsign = function(anntype) {
		docsign[anntype].backup = angular.copy(docsign[anntype].obj);
		return true;
	};
	
	/**
	 * Revert to the old data
	 * 
	 */
	docsign.revertBackupDocsign = function(anntype) {
		if (docsign[anntype].backup) {
			docsign[anntype].obj = angular.copy(docsign[anntype].backup);
			docsign[anntype].backup = null;
			docsign[anntype].doc = null;
			docsign[anntype].docName = null;
		}
	};
	
	/**
	 * Check docsign object
	 * 
	 */
	docsign.clearDocsignObj = function(objtype) {
		docsign[objtype] = {
			list: null,
			obj: null,
			doc: null,
			docName: null
		};
	};
	
	/**
	 * Get all docsigns for a given object and object type
	 * 
	 * @param {string} objid: 
	 * @param {string} objtype:
	 * @param {function} callback
	 */
	docsign.getAllDocsigns = function(objid, objtype, callback) {
		var xsrf = $.param({
			objid: objid,
			objtype: objtype
		});
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/docsigns/getAll',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data, status, headers, config) {
			App.checkUserSession(data);
			if (data.ack) {
				docsign[objtype].list = data.payload.list;
				if (_.isFunction(callback)) callback(true, null, data.payload);
			} else {
				if (_.isFunction(callback)) callback(false, $translate('ANNOTATION.ERR.GETANNLISTFAIL'), null);
			}
		}).error(function(data, status, headers, config) {
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	
	/**
	 * Create new docsign
	 * 
	 * @param {string} objid: id of the object to annotate
	 * @param {string} objtype: type of the object to annotate
	 * @param {function} callback
	 */
	docsign.createDocsignDetails = function(objid, objtype, callback) {
		var saveobj = angular.copy(docsign[objtype].obj);
		saveobj.objid = objid;
		saveobj.objtype = objtype;
		var xsrf = $.param(saveobj);
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/docsigns/create',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data, status, headers, config) {
			App.checkUserSession(data);
			if (data.ack) {
				$analytics.eventTrack('DocsignEdit', {  type: 'create' });

				if (_.isFunction(callback)) callback(true, null, data.payload);
			} else {
				if (_.isFunction(callback)) callback(false, data.message, null);
			}
		}).error(function(data, status, headers, config) {
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	
	/**
	 * Update docsign
	 * 
	 * @param {string} annid: docsign id
	 * @param {string} objtype type of the object to annotate
	 * @param {function} callback
	 */
	docsign.updateDocsignDetails = function(annid, objtype, callback) {
		var xsrf = $.param({
			id: annid,
			type: docsign[objtype].obj.type,
			body: docsign[objtype].obj.body
		});
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/docsigns/update',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data, status, headers, config) {
			App.checkUserSession(data);
			if (data.ack) {
				if (_.isFunction(callback)) callback(true, null, data.payload);
			} else {
				if (_.isFunction(callback)) callback(false, data.message, null);
			}
		}).error(function(data, status, headers, config) {
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	
	/**
	 * Delete docsign
	 * 
	 * @param {string} annid: docsign id
	 * @param {function} callback
	 */
	docsign.deleteDocsign = function(annid, callback) {
		var xsrf = $.param({
			id: annid
		});
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/docsigns/delete',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data, status, headers, config) {
			App.checkUserSession(data);
			if (data.ack) {
				if (_.isFunction(callback)) callback(true, null, data.payload);
			} else {
				if (_.isFunction(callback)) callback(false, data.message, null);
			}
		}).error(function(data, status, headers, config) {
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	
	/**
	 * Open a new window with the print of docsign
	 * 
	 * @param {string} annid docsign id
	 */
	docsign.printDocsign = function(filename, formarr) {
		var form = JSON.stringify(formarr);
		var xsrf = $.param({
			filename: filename,
			form: form
		});
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/docsigns/printDocsign',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			responseType:'arraybuffer'
		}).
		success(function(data, status, headers, config) {
			App.checkUserSession(data);
			if (data) {
				var file = new Blob([data], {type: 'application/pdf'});
				var fileURL = URL.createObjectURL(file);

				window.open(fileURL);
			} else {
				Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), $translate('GENERAL.ERR.PRINTFAIL'));
			}
		}).error(function(data, status, headers, config) {
			Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), $translate('GENERAL.ERR.SERVERFAIL'));
		});
	};
	
	return docsign;
}]);
