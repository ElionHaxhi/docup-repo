var appService = angular.module('appService', []);

appService.factory('Service', ['$http', '$translate', '$analytics', 'App', 'Config', 'Gendialog', 'User', function($http, $translate, $analytics, App, Config, Gendialog, User) {
	
	var service = {
		available: {
			currid: null,
			list: null,
			obj: null
		},
		selected: {
			patient: {
				currid: null,
				list: null,
				obj: null
			},
			exam: {
				currid: null,
				list: null,
				obj: null
			}
		}
	};
	
	/**
	 * Clear the selected services for patient
	 * 
	 */
	service.clearSelserviceObj = function(type) {
		service.selected[type] = {
			currid: null,
			list: null,
			obj: null
		};
	};
	
	/*
	 * AVAILABLE SERVICES
	 */
	
	/**
	 * Clear the available services
	 * 
	 */
	service.clearAvaserviceObj = function() {
		service.available = {
			currid: null,
			list: null,
			obj: null
		};
	};
	
	/**
	 * Get all available services
	 * 
	 * @param function[optional] callback
	 */
	service.getAllAvailableServices = function(callback) {
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/services/getAll',
		    data: null,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data, status, headers, config) {
			App.checkUserSession(data);
			if (data.ack) {
				service.available.list = data.payload;
				if (_.isFunction(callback)) callback(true, null, data.payload);
			} else {
				if (_.isFunction(callback)) callback(false, $translate('SERVICE.ERR.GETAVASERVLISTFAIL'), null);
			}
		}).error(function(data, status, headers, config) {
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	
	/**
	 * Create new available service
	 * 
	 * @param function callback
	 */
	service.createAvailableServiceDetails = function(callback) {
		var saveobj = angular.copy(service.available.obj);
		var xsrf = $.param(saveobj);
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/services/create',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data, status, headers, config) {
			App.checkUserSession(data);
			if (data.ack) {
				$analytics.eventTrack('ServiceAvailableEdit', {  type: 'create' });

				service.available.obj = null;
				service.getAllAvailableServices(callback);
			} else {
				if (_.isFunction(callback)) callback(false, data.message, null);
			}
		}).error(function(data, status, headers, config) {
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	
	/**
	 * Update available service
	 * 
	 * @param function callback [optional]
	 */
	service.updateAvailableServiceDetails = function(callback) {
		var saveobj = angular.copy(service.available.obj);
		var xsrf = $.param(saveobj);
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/services/update',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data, status, headers, config) {
			App.checkUserSession(data);
			if (data.ack) {
				service.available.obj = null;
				service.getAllAvailableServices(callback);
			} else {
				if (_.isFunction(callback)) callback(false, data.message, null);
			}
		}).error(function(data, status, headers, config) {
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	
	/**
	 * Delete available service
	 * 
	 * @param string servid unique service id
	 * @param function callback
	 */
	service.deleteAvailableService = function(servid, callback) {
		var xsrf = $.param({
			id: servid
		});
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/services/delete',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data, status, headers, config) {
			App.checkUserSession(data);
			if (data.ack) {
				service.available.obj = null;
				service.getAllAvailableServices(callback);
			} else {
				if (_.isFunction(callback)) callback(false, data.message, null);
			}
		}).error(function(data, status, headers, config) {
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	
	/*
	 * SERVICE LINKS
	 */
	
	/**
	 * Get all services for a given exam or patient
	 * 
	 * @param {string} objtype type of object to link ('patient' for patient, 'exam' for exam, ...)
	 * @param {string} objid unique object id
	 * @param {function}[optional] callback
	 */
	service.getAllServices = function(objtype, objid, callback) {
		var saveobj = {};
		saveobj.objtype = objtype;
		saveobj.objid = objid;
		var xsrf = $.param(saveobj);
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/servicelinks/getAll',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data, status, headers, config) {
			App.checkUserSession(data);
			if (data.ack) {
				service.selected[objtype].list = data.payload;
				if (_.isFunction(callback)) callback(true, null, data.payload);
			} else {
				if (_.isFunction(callback)) callback(false, data.message, null);
			}
		}).error(function(data, status, headers, config) {
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	
	/**
	 * Create a new service link between a service and an object of different kinds
	 * 
	 * @param {string} objtype type of object to link ('PAT' for patient, 'EXA' for exam, ...)
	 * @param {string} objid unique object id
	 * @param {string} serviceguid unique service guid
	 * @param {function}[optional] callback
	 */
	service.includeAvailableServiceToObject = function(objtype, objid, servid, callback) {
		var saveobj = {};
		saveobj.servid = servid;
		saveobj.objtype = objtype;
		saveobj.objid = objid;
		var xsrf = $.param(saveobj);
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/servicelinks/create',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data, status, headers, config) {
			App.checkUserSession(data);
			if (data.ack) {
				$analytics.eventTrack('ServiceAssignedEdit', {  type: 'create' });

				service.getAllServices(objtype, objid, callback);
			} else {
				if (_.isFunction(callback)) callback(false, data.message, null);
			}
		}).error(function(data, status, headers, config) {
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	
	/**
	 * Delete service link
	 * 
	 * @param {string} objtype type of object to link ('PAT' for patient, 'EXA' for exam, ...)
	 * @param {string} objguid unique object guid
	 * @param {string} servlinkguid unique service link guid
	 * @param function[optional] callback
	 */
	service.deleteServicelink = function(objtype, objid, servlinkid, callback) {
		var xsrf = $.param({
			id: servlinkid
		});
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/servicelinks/delete',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data, status, headers, config) {
			App.checkUserSession(data);
			if (data.ack) {
				service.selected[objtype].obj = null;
				service.getAllServices(objtype, objid, callback);
			} else {
				if (_.isFunction(callback)) callback(false, data.message, null);
			}
		}).error(function(data, status, headers, config) {
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	
	/**
	 * Update service link
	 * 
	 * @param function callback [optional]
	 */
	service.updateServiceDetails = function(objtype, objid, callback) {
		var saveobj = angular.copy(service.selected[objtype].obj);
		var xsrf = $.param(saveobj);
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/servicelinks/update',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data, status, headers, config) {
			App.checkUserSession(data);
			if (data.ack) {
				service.selected[objtype].obj = null;
				service.getAllServices(objtype, objid, callback);
			} else {
				if (_.isFunction(callback)) callback(false, data.message, null);
			}
		}).error(function(data, status, headers, config) {
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	
	/**
	 * Update service link setting to paid
	 * 
	 * @param {string} id service link id
	 * @param {function} callback [optional]
	 */
	service.updateServicePaid = function(objtype, objid, servlinkid, callback) {
		var xsrf = $.param({
			id: servlinkid
		});
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/servicelinks/updatePaid',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data, status, headers, config) {
			App.checkUserSession(data);
			if (data.ack) {
				service.getAllServices(objtype, objid, callback);
			} else {
				if (_.isFunction(callback)) callback(false, data.message, null);
			}
		}).error(function(data, status, headers, config) {
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	
	/**
	 * Open a new window with the print of services list for a given patient or exam
	 * 
	 * @param {string} objtype type of object to link ('patient' for patient, 'exam' for exam, ...)
	 * @param {string} objid
	 * */
	service.printServicesList = function(objtype, objid) {
		var xsrf = $.param({
			objtype: objtype,
			objid: objid
		});
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/servicelinks/printList',
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
			if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	
	return service;
}]);
