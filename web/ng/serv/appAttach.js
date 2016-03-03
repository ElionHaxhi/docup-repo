var appAttach = angular.module('appAttach', []);

appAttach.factory('Attach', ['$http', '$location', '$translate', 'App', 'Config', 'Gendialog', 
	function($http, $location, $translate, App, Config) {
	
	var attach = {
		list: null,
		obj: null,
		currPatientId: null,
		currExamId: null
	};
	
	/**
	 * Clear attach object
	 * 
	 */
	attach.clearAttachObj = function() {
		attach.list = null;
		attach.obj = null;
		attach.currPatientId = null;
		attach.currExamId = null;
	};
	
	/**
	 * Get all attachs for a given patient or exam
	 * 
	 * @param patientid
	 * @param examid
	 * @param callback
	 * @return 
	 */
	attach.getAllAttachsList = function(patientid, examid, callback) {
		attach.currPatientId = patientid;
		attach.currExamId = examid;
		var saveobj = {
			patientid: patientid,
			examid: examid
		};
		var xsrf = $.param(saveobj);
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/attachs/getAll',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data) {
			App.checkUserSession(data);
			if (data.ack) {
				attach.list = data.payload;
				if (_.isFunction(callback)) callback(true, null, data.payload);
			} else {
				if (_.isFunction(callback)) callback(false, $translate('ATTACH.ERR.GETFILESLISTFAIL'), null);
			}
		}).error(function() {
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	
	/**
	 * Delete attach from file path
	 * 
	 * @param filepath of the deleted file
	 * @param fileid of the deleted file
	 * @param callback
	 */
	attach.delAttach = function( fileid, filepath, callback) {
		var saveobj = {
			fileid: fileid,
			filepath: filepath
		};
		var xsrf = $.param(saveobj);
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/attachs/delete',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data) {
			App.checkUserSession(data);
			if (data.ack) {
				if (_.isFunction(callback)) callback(true, null, data.payload);
			} else {
				if (_.isFunction(callback)) callback(false, $translate('ATTACH.ERR.DELFILEFAIL'), null);
			}
		}).error(function() {
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	
	return attach;
}]);