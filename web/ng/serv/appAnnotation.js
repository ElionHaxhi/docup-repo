var appAnnotation = angular.module('appAnnotation', []);

appAnnotation.factory('Annotation', ['$http', '$translate', '$analytics', 'App', 'Config', 'Gendialog', 'User',
	function($http, $translate, $analytics, App, Config, Gendialog, User) {
	
	var annotation = {
		patient: {
			list: null,
			obj: null,
			backup: null
		},
		exam: {
			list: null,
			obj: null,
			backup: null
		}
	};
	
	/**
	 * Save the object
	 * 
	 */
	annotation.backupAnnotation = function(anntype) {
		annotation[anntype].backup = angular.copy(annotation[anntype].obj);
		return true;
	};
	
	/**
	 * Revert to the old data
	 * 
	 */
	annotation.revertBackupAnnotation = function(anntype) {
		if (annotation[anntype].backup) {
			annotation[anntype].obj = angular.copy(annotation[anntype].backup);
			annotation[anntype].backup = null;
		}
	};
	
	/**
	 * Check annotation object
	 * 
	 */
	annotation.clearAnnotationObj = function(objtype) {
		annotation[objtype] = {
			list: null,
			obj: null
		};
	};
	
	/**
	 * Get all annotations for a given object and object type
	 * 
	 * @param {string} objid: 
	 * @param {string} objtype:
	 * @param {function} callback
	 */
	annotation.getAllAnnotations = function(objid, objtype, callback) {
		var xsrf = $.param({
			objid: objid,
			objtype: objtype
		});
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/annotations/getAll',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data, status, headers, config) {
			App.checkUserSession(data);
			if (data.ack) {
				annotation[objtype].list = data.payload.list;
				if (_.isFunction(callback)) callback(true, null, data.payload);
			} else {
				if (_.isFunction(callback)) callback(false, $translate('ANNOTATION.ERR.GETANNLISTFAIL'), null);
			}
		}).error(function(data, status, headers, config) {
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	
	/**
	 * Create new annotation
	 * 
	 * @param {string} objid: id of the object to annotate
	 * @param {string} objtype: type of the object to annotate
	 * @param {function} callback
	 */
	annotation.createAnnotationDetails = function(objid, objtype, callback) {
		var saveobj = angular.copy(annotation[objtype].obj);
		saveobj.objid = objid;
		saveobj.objtype = objtype;
		var xsrf = $.param(saveobj);
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/annotations/create',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data, status, headers, config) {
			App.checkUserSession(data);
			if (data.ack) {
				$analytics.eventTrack('AgendaEdit', {  type: 'create' });

				if (_.isFunction(callback)) callback(true, null, data.payload);
			} else {
				if (_.isFunction(callback)) callback(false, data.message, null);
			}
		}).error(function(data, status, headers, config) {
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	
	/**
	 * Update annotation
	 * 
	 * @param {string} annid: annotation id
	 * @param {string} objtype type of the object to annotate
	 * @param {function} callback
	 */
	annotation.updateAnnotationDetails = function(annid, objtype, callback) {
		var xsrf = $.param({
			id: annid,
			type: annotation[objtype].obj.type,
			body: annotation[objtype].obj.body
		});
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/annotations/update',
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
	 * Delete annotation
	 * 
	 * @param {string} annid: annotation id
	 * @param {function} callback
	 */
	annotation.deleteAnnotation = function(annid, callback) {
		var xsrf = $.param({
			id: annid
		});
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/annotations/delete',
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
	 * Open a new window with the print of annotation
	 * 
	 * @param {string} annid annotation id
	 */
	annotation.printAnnotationDetails = function(id) {
		var xsrf = $.param({
			id: id
		});
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/annotations/printDetails',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data, status, headers, config) {
			App.checkUserSession(data);
			if (data.ack) {
				var newwin =  window.open('','','');
			    newwin.document.open();
			    newwin.document.write(data.payload);
			    newwin.document.close();
			} else {
				Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), $translate('GENERAL.ERR.PRINTFAIL'));
			}
		}).error(function(data, status, headers, config) {
			Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), $translate('GENERAL.ERR.SERVERFAIL'));
		});
	};
	
	return annotation;
}]);
