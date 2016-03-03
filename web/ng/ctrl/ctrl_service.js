function serviceCtrl($scope, $location, $modal, $translate, Navbar, Gendialog, Service, User) {
	
	/*
	 * SCOPE
	 */
	
	$scope.service = Service;
	$scope.navbar = Navbar;
	$scope.avaserviceviz = {
		create: false,
		write: false
	};
	$scope.serviceviz = {
		write: false
	};
	
	/*
	 * PRIV FUNCS
	 */
	var callbackAvailableServiceUpdated = function(ack, msg, payload) {
		if (!ack) {
			Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), msg);
		}
		$scope.avaserviceviz.write = false;
		$scope.avaserviceviz.create = false;
	};
	
	/*
	 * AVAILABLE SERVICES
	 */
	
	/**
	 * Refresh list of available services
	 * 
	 */
	$scope.refreshAvailableServicesList = function() {
		Service.getAllAvailableServices();
	};
	
	/**
	 * Enable creation of new annotation
	 * 
	 */
	$scope.openCreateNewAvailableService = function(type) {
		Service.available.obj = null;
		$scope.avaserviceviz.write = true;
		$scope.avaserviceviz.create = true;
	};	
	
	/**
	 * Close the editing window for available service for patient
	 * 
	 */
	$scope.backAvaserviceUpdate = function() {
		Service.available.obj = null;
		$scope.avaserviceviz.write = false;
		$scope.avaserviceviz.create = false;
	};
	
	/**
	 * Select avaialble service
	 * 
	 */
	$scope.selectAvaservice = function(servobj) {
		Service.available.obj = servobj;
		$scope.avaserviceviz.write = true;
		$scope.avaserviceviz.create = false;
	};
	
	/**
	 * Create or update a service logic
	 * 
	 */
	$scope.updateAvaserviceDetails = function() {
		if ($scope.editAvaserviceForm.$valid) {
			if (Service.available.obj && Service.available.obj.id) {
				Service.updateAvailableServiceDetails(callbackAvailableServiceUpdated);
			} else {
				Service.createAvailableServiceDetails(callbackAvailableServiceUpdated);
			}
		} else {
			Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), $translate('GENERAL.FORM.FORMNOTVALID') + '. ' + $translate('GENERAL.FORM.FORMCHECKMANDATORY') + '.');
		}
	};
	
	/**
	 * Dialog to confirm service remove
	 * 
	 * @param object serv available service object
	 */
	$scope.openAvaserviceDialogDeleteConfirm = function(servid) {
		var dialogtitle = $translate('SERVICE.MSG.REMOVECONFIRM_TITLE');
		var dialogmsg = $translate('SERVICE.MSG.REMOVECONFIRM_QUEST');
		Gendialog.openConfirmDialog(dialogtitle, dialogmsg, $scope.deleteAvaservice, [servid]);
	};
	
	/**
	 * Delete an available service
	 * 
	 */
	$scope.deleteAvaservice = function() {
		Service.deleteAvailableService(Service.available.obj.id, callbackAvailableServiceUpdated);
	};
	
	/**
	 * Check row selected
	 * 
	 */
	$scope.checkRowSelected = function(id) {
		//console.log(id);
		//console.log(Service.available.obj.id);
		if (Service.available.obj.id == id) {
			return true;
		} else {
			return false;
		}
	};
	
	/*
	 * SERVICE LINKS
	 */
	
	var callbackServiceUpdated = function(ack, msg, payload) {
		if (!ack) {
			Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), msg);
		}
		$scope.serviceviz.write = false;
	};
	
	/**
	 * Enable update of service link
	 * 
	 */
	$scope.openUpdateService = function(type) {
		Service.selected[type].obj = null;
		$scope.serviceviz.write = true;
	};	
	
	/**
	 * Close the editing window for service link
	 * 
	 */
	$scope.backServiceUpdate = function(type) {
		Service.selected[type].obj = null;
		$scope.serviceviz.write = false;
	};
	
	/**
	 * Select service link
	 * 
	 * @param {string} type service link type
	 * @param {object} servobj service link object
	 */
	$scope.selectService = function(type, servobj) {
		$scope.serviceviz.write = true;
		Service.selected[type].obj = servobj;
	};
	
	/**
	 * Refresh list of servises for the object
	 * 
	 * @param {string} objtype
	 * @param {string} objid
	 */
	$scope.refreshServicesList = function(objtype, objid) {
		Service.getAllServices(objtype, objid);
	};
	
	/**
	 * Add an available service to the current patient
	 * 
	 * @param {string} objtype
	 * @param {string} objid
	 * @param {string} id service link
	 */
	$scope.includeServiceToObject = function(objtype, objid, id) {
		Service.includeAvailableServiceToObject(objtype, objid, id);
	};
	
	/**
	 * Open dialog to remove a service link
	 * 
	 * @param {string} objtype
	 * @param {string} objid
	 * @param {string} id service link
	 */
	$scope.openServicelinkDialogRemoveConfirm = function(objtype, objid, id) {
		var dialogtitle = $translate('SERVICE.MSG.REMOVECONFIRM_TITLEAVA');
		var dialogmsg = $translate('SERVICE.MSG.REMOVECONFIRM_QUESTAVA');
		Gendialog.openConfirmDialog(dialogtitle, dialogmsg, $scope.deleteServicelinkFromObject, [objtype, objid, id]);
	};
	
	/**
	 * Delete service link from patient
	 * 
	 * @param {string} objtype
	 * @param {string} objid
	 * @param {string} servlink service link
	 */
	$scope.deleteServicelinkFromObject = function(objtype, objid, id) {
		Service.deleteServicelink(objtype, objid, id);
	};
	
	/**
	 * Print service links list for patient
	 * 
	 * @param {string} objtype
	 * @param {string} objid
	 */
	$scope.printServicesList = function(objtype, objid) {
		Service.printServicesList(objtype, objid);
	};
	
	/**
	 * Update service link
	 * 
	 * @param {string} type
	 */
	$scope.updateServiceDetails = function(objtype, objid) {
		if ($scope.editServiceForm.$valid) {
			if (Service.selected[objtype] && Service.selected[objtype].obj && Service.selected[objtype].obj.id) {
				Service.updateServiceDetails(objtype, objid, callbackServiceUpdated);
			}
		} else {
			Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), $translate('GENERAL.FORM.FORMNOTVALID') + '. ' + $translate('GENERAL.FORM.FORMCHECKMANDATORY') + '.');
		}
	};
	
	/**
	 * Set service link as paid
	 * 
	 * @param {string} type type of service
	 * @param {string} id service link id
	 */
	$scope.servicePaid = function(objtype, objid, id) {
		Service.updateServicePaid(objtype, objid, id, callbackServiceUpdated);
	};
	
};

