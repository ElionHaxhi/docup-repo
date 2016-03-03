var appFlexschema = angular.module('appFlexschema', []);

appFlexschema.factory('Flexschema', ['$http', '$location', '$translate', 'App', 'Config', 'Gendialog', 'User',
	function($http, $location, $translate, App, Config, Gendialog, User) {

	var flexschema = {
		flex: {
			available: [],
			downloaded: [],
			current: {
				patient: {
					patient_flexform: null
				},
				exam: {
					exam_flexform: null
				},
				measure: {
					measure_flexform: null
				}
			},
			initial: {
				patient: {
					patient_flexform: null
				},
				exam: {
					exam_flexform: null
				},
				measure: {
					measure_flexform: null
				}
			}
		}
	};

	/**
	 * Retrieve flexform description from flexform db name for exam
	 *
	 * @param {string} flextype
	 * @param {string} dbname name fo the flexform on the db
	 * @return string description of the flexform
	 */
	flexschema.getFlexformDescrFromDbname = function(flextype, dbname) {
		var sel = _.find(flexschema.flex.available[flextype], function(obj){
			return dbname == obj.dbname;
		});

		return (sel) ? sel.descr : null;
	};

	/**
	 * Prepare the init values for a flexschema
	 *
	 * @param {object} flexschema point to the flexschema schema to get the properties list
	 * @param {object} flexobj point to the element to be initialized
	 * @return boolean
	 */
	flexschema.prepareFleformObject = function(flexschema, flexobj) {
		if (flexschema && flexschema.properties) {
			_.each(flexschema.properties, function(elem, index) {
				if (elem.initval) {
					flexobj[index] = elem.initval;
				}
			});
			return true;
		} else {
			return false;
		}
	};

	/**
	 * Retrieve from the user settings the flexschema names which are opened in case of new patient or new exam
	 *
	 */
	flexschema.setupFlexSchemas = function() {
		if (User.info.json_admin && User.info.json_admin.appparam && User.info.json_admin.appparam.flexpatienttype) {
			flexschema.flex.initial.patient.patient_flexform = User.info.json_admin.appparam.flexpatienttype;
		}
		if (User.info.json_admin && User.info.json_admin.appparam && User.info.json_admin.appparam.flexformtype) {
			flexschema.flex.initial.exam.exam_flexform = User.info.json_admin.appparam.flexformtype;
		}
		if (User.info.json_admin && User.info.json_admin.appparam && User.info.json_admin.appparam.flexmeasuretype) {
			flexschema.flex.initial.measure.measure_flexform = User.info.json_admin.appparam.flexmeasuretype;
		}

		_.each(flexschema.flex.available.measure, function(elem){
			flexschema.getFlexSchema(elem.type, elem.dbname, null, function(ack, msg, flexform){ });
		});
	};

	/**
	 * Get from server the list of all the available flexschemas (patient, exam)
	 *
	 * @param {function} callback
	 */
	flexschema.getAllAvailableFlexformsLists = function(callback) {
		var xsrf = $.param({
			lang: 'it'
		});
		$http({
			method: 'POST',
			url:  Config.base_url + Config.api_version + '/flexform/getAllFlexInfo',
			data: xsrf,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		})
		.success(function(data) {
			if (data.ack) {
				//console.log('Available flexschemas loaded');
				// get all avaialble flexschemas for exam
				flexschema.flex.available = data.payload;
				if (callback) {
					callback(true);
				}
			} else {
				Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), $translate('GETFLEXLISTFAIL'));
				if (callback) {
					callback(false);
				}
			}
		})
		.error(function() {
			Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), $translate('SERVERFAIL'));
			if (callback) {
				callback(false);
			}
		});
	};

	/**
	 * Get current flexschema by name
	 *
	 * @param {string} type type of flexschema
	 * @param {string} currentName name of the flexschema saved as current name
	 * @return string description of the flexschema
	 */
	flexschema.getCurrentFlexformByName = function(type, currentName) {
		if (flexschema.flex.current[type] && flexschema.flex.current[type][currentName]) {
			return flexschema.flex.current[type][currentName];
		} else {
			if (flexschema.flex.initial[type][currentName]) {
				return type, flexschema.flex.initial[type][currentName];
			} else {
				return null;
			}
		}
	};

	/**
	 * Get initial flexschema by name
	 *
	 * @param {string} type type of flexschema
	 * @param {string} initialName name of the flexschema saved as initial name
	 * @return string description of the flexschema
	 */
	flexschema.getInitialFlexformByName = function(type, initialName) {
		if (flexschema.flex.initial[type] && flexschema.flex.initial[type][initialName]) {
			return type, flexschema.flex.initial[type][initialName];
		} else {
			return null;
		}
	};

	/**
	 * Get a flexschema schema, download from server if needed
	 *
	 * @param {string} flextype type of the flexschema
	 * @param {string} flexname name of the flexschema
	 * @param {string} currentName
	 * @param {function} callback
	 */
	flexschema.getFlexSchema = function(flextype, flexname, currentName, callback) {
		// prepare current object if needed
		if (!flexschema.flex.current[flextype]) {
			flexschema.flex.current[flextype] = {};
		}
		// prepare the current schema
		if (!flexname) {
			// case the flexname is null
			if (currentName) flexschema.flex.current[flextype][currentName] = null;
			callback(true, null, null);
		} else {
			if (flexschema.flex.downloaded[flextype] && flexschema.flex.downloaded[flextype][flexname]) {
				// case the flexschema is already downloaded
				if (currentName) flexschema.flex.current[flextype][currentName] = flexname;
				callback(true, null, flexschema.prepareFlexObject(flextype, flexname));
			} else {
				// case to download the schema from server
				flexschema.getFlexSchemaFromServer(flextype, flexname, function(ack, msg, payload) {
					if (ack && payload) {
						if (currentName) flexschema.flex.current[flextype][currentName] = flexname;
						if (!flexschema.flex.downloaded[flextype]) {
							flexschema.flex.downloaded[flextype] = {};
						}
						flexschema.flex.downloaded[flextype][flexname] = JSON.parse(payload);
						callback(true, null, flexschema.prepareFlexObject(flextype, flexname));
					} else {
						callback(false, null, null);
					}
				});
			}
		}
	};

	/**
	 * Prepare Flexform object from flexschema schema json
	 *
	 * @param {string} flextype type of the flexschema
	 * @param {string} flexname name of the flexschema
	 */
	flexschema.prepareFlexObject = function(flextype, flexname) {
		var flexObj = {};
		if (flextype && flexname && flexschema.flex.downloaded[flextype] && flexschema.flex.downloaded[flextype][flexname]) {
			flexObj.schema = flexschema.flex.downloaded[flextype][flexname];
			flexObj.version = flexObj.schema.description;
			flexObj.schemaTab = flexObj.schema.formlayout.tablet.tabs;
			flexObj.schemaForm = flexObj.schema.formlayout.tablet.mainsects;
			if (flexObj.schema.vizlayout) {
				flexObj.schemaViz = flexObj.schema.vizlayout.tablet.mainsects;
			} else {
				flexObj.schemaViz = flexObj.schema.formlayout.tablet.mainsects;
			}
			return flexObj;
		} else {
			return null;
		}
	};

	/**
	 * Download a flexschema file from server
	 *
	 * @param {string} flextype type of the flexschema
	 * @param {string} flexname name of the flexschema
	 * @param {function} callback
	 */
	flexschema.getFlexSchemaFromServer = function(flextype, flexname, callback) {
		// get flex file name from db name
		var flexobj = _.find(flexschema.flex.available[flextype], function(obj){
			return flexname == obj.dbname;
		});

		if(flexobj){
			var xsrf = $.param({
				lang: 'it',
				type: flextype,
				name: flexobj.filename
			});
			$http({
				method: 'POST',
				url:  Config.base_url + Config.api_version + '/flexform/getFlexformFile',
				data: xsrf,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).
			success(function(data) {
				if (data.ack) {
					callback(true, null, data.payload);
				} else {
					callback(false, data.message, null);
				}
			}).error(function() {
				callback(false, $translate('SERVERFAIL'), null);
			});
		}
	};

	/**
	 *
	 *
	 * @param {string} objlist name of the fix form
	 * @param {string} index_text
	 * @param {string} index_value
	 */
	flexschema.getFlexStyleDropdownFromList = function(objlist, index_text, index_value) {
		var listarr = [];
		_.each(objlist, function(elem) {
			var obj = {
				"text": elem[index_text],
				"value": elem[index_value]
			};
			listarr.push(obj);
		});

		return {
			type: 'dropdown',
			list: listarr
		};
	};

	return flexschema;
}]);
