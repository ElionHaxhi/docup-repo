var appUser = angular.module('appUser', []);

appUser.factory('User', ['$http', '$translate', 'App', 'Config', 'Gendialog', function($http, $translate, App, Config, Gendialog) {
	
	var user = {
		info: {},
		lang: 'it',
		counters: {
			patient: null,
			appoint: null,
			exam: null
		},
		assistant: null,
		security: null,
		news: []
	};
	
	/**
	 * Get all active exams for the user
	 * 
	 * @return boolean true in case user is loaded
	 */
	user.checkUserIsLoaded = function() {
		return user && user.info;
	};
	
	user.getLicenseName = function(fullname) {
		switch(user.info.trial) { 
  			case 'F': 
  				if (fullname) {
  					return 'Family';
  				} else {
					return 'FAM';
				}
			break;
			case 'S': 
				if (fullname) {
  					return 'Standard';
  				} else {
					return 'STD';
				}
			break;
			case 'P': 
				if (fullname) {
  					return 'Professional';
  				} else {
					return 'PRO';
				}
			break;
			case 'C': 
				if (fullname) {
  					return 'Cloud';
  				} else {
					return 'CLD';
				}
			break;
			case 'A': 
				if (fullname) {
  					return 'Assistant';
  				} else {
					return 'ASS';
				}
			break;
			default:
				if (fullname) {
  					return 'Free';
  				} else {
					return 'FRE';
				}
		}
	};
	
	/**
	 * Control if license is free for limitation 
	 * 
	 */
	user.checkLicenseFreeLimit = function($limitType) {
		if (user.info.trial === "Y") {
			if ($limitType == "PAT") {
				if (parseInt(user.counters.patient) >= App.params.freelimitpatient) {
					return "PAT";
				} else {
					return false;
				}
			} else if ($limitType == "EXA") {
				if (parseInt(user.counters.patient) > App.params.freelimitpatient) {
					return "PAT";
				} else {
					return false;
				}
			} else {
				if (parseInt(user.counters.appoint) >= App.params.freelimitappoint) {
					return "APP";
				} else {
					return false;
				}
			}
		}
		//console.log('License checked');
	};
	
	/**
	 * Get user info 
	 * 
	 * @param {function} callback
	 */
	user.getUserInfo = function(callback) {
		$http.post(Config.base_url + Config.api_version + '/users/get')
		.success(function(data, status, headers, config) {
			App.checkUserSession(data);
			if (data.payload && _.isObject(data.payload)) {
				user.lang = data.payload.culture.split("_").pop();
				user.info = data.payload;
				// setup default json_admin if not present
				if (!user.info.json_admin) {
					user.info.json_admin = {
						"webuser": {
					        "webuserid": null,
					        "webusernick": null,
					        "pswmd5": null,
					        "pswsha": null
					    },
					    "agenda": {
					        "starthour": 9,
					        "endhour": 19,
					        "appointduration": "01:00",
					        "slotduration": 30,
					        "weekendviz": "ALL"
					    },
					    "doctor": {
					        "doctorname": null,
					        "doctorsurname": null,
					        "doctoremail": null,
					        "doctortype": null
					    },
					    "appparam": {
					        "flexpatienttype": null,
					        "flexformtype": null,
					        "flexmeasuretype": null,
					        "flexformsactivearr": [],
					        "securitypin": null,
					        "writecontacts": "N",
					        "lastexamdataviz": "N",
					        "textautocorrect": "N",
					        "currencysymbol": "€",
					        "decimalseparator": ",",
					        "decimalsize": 2,
					        "thousandsseparator": ".",
					        "dateformat": "DD/MM/YYYY",
					        "timeformat": "HH:mm",
					        "datetimeformat": "DD/MM/YYYY HH:mm",
					        "lang": user.lang,
					        "firstrun": true,
					        "configtutorialcomplete": false,
					        "guidecomplete": false
					    },
					    "modsenable": {
					        "services": "Y",
					        "annotations": "Y",
					        "webdocs": "Y",
					        "pics": "Y",
					        "audio": "Y",
					        "dropbox": "Y",
					        "paints": "Y"
					    },
					    "prints": {
					        "printheader": null,
					        "printfooter": null
					    }
					};
				}
				// check the case of assistant
				if (data.payload.assistant) {
					user.assistant = data.payload.assistant;
					user.assistant.json_admin = JSON.parse(user.assistant.json_admin);
					user.info.name = user.assistant.name;
					user.info.surname = user.assistant.surname;
					user.info.trial = user.assistant.trial;
					user.security = user.assistant.json_admin.security;
				}
				//console.log(user.info);
				callback(true);				
			} else {
				Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), $translate('USER.ERR.USERPARAMLOADFAIL'));
				callback(false);
			}
		}).error(function(data, status, headers, config) {
			Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), $translate('USER.ERR.USERPARAMLOADFAIL'));
			callback(false);
		});
	};
	
	/**
	 * Get types list for dropdown
	 * 
	 * @return annotation types list for dropdown
	 */
	user.getDropdownList = function(list, nameFieldText, nameFieldValue) {
		var newarr = [];
		if (!nameFieldText) {
			nameFieldText = 'text';
		}
		if (!nameFieldValue) {
			nameFieldValue = 'code';
		}
		for (var i in list) {
			newarr.push({'text': list[i][nameFieldText], 'value': list[i][nameFieldValue]});
		}
		var arrlist = {
			type: 'dropdown',
			list: newarr
		};
		return arrlist;
	};
	
	/**
	 * Get all annotation types
	 * 
	 * @return array annotation types list or empty array if null
	 */
	user.getAllAnnotationsTypeData = function() {
		var anntypes = null;
		if (user.info.json_sync && user.info.json_sync.flextypes && user.info.json_sync.flextypes.annotationtypes) {
			if (user.info.json_sync.flextypes.annotationtypes['it']) {
				return user.info.json_sync.flextypes.annotationtypes['it'];
			} else {
				return user.info.json_sync.flextypes.annotationtypes;
			}
		} else {
			return new Array();
		}
	};
	
	/**
	 * Get annotation type description from annotation type code
	 * 
	 * @param string anntype annotation type code
	 * @return string annotation type description
	 */
	user.getAnnotationTypeData = function(anntype) {
		var arrtypes = user.getAllAnnotationsTypeData();
		return  _.findWhere(arrtypes, {code: anntype});
	};
	
	/**
	 * Get if annotation types list is empty
	 * 
	 * @return boolean 
	 */
	user.isEmptyAnnotationsTypeData = function() {
		return _.isEmpty(user.getAllAnnotationsTypeData());
	};
	
	/**
	 * Get all appoint types
	 * 
	 * @return array appoint types list or empty array if null
	 */
	user.getAllAppointsTypeData = function() {
		var apptypes = null;
		if (user.info.json_sync && user.info.json_sync.flextypes && user.info.json_sync.flextypes.appointtypes) {
			if (user.info.json_sync.flextypes.appointtypes['it']) {
				apptypes = user.info.json_sync.flextypes.appointtypes['it'];
			} else {
				apptypes = user.info.json_sync.flextypes.appointtypes;
			}
		}
		if (apptypes) {
			return apptypes;
		} else {
			return new Array();
		}
	};
	
	/**
	 * Get appoint type description from appoint type code
	 * 
	 * @param string apptype appoint type code
	 * @return string appoint type description
	 */
	user.getAppointTypeData = function(apptype) {
		var arrtypes = user.getAllAppointsTypeData();
		return  _.findWhere(arrtypes, {code: apptype});
	};
	
	/**
	 * Get if appoint types list is empty
	 * 
	 * @return boolean 
	 */
	user.isEmptyAppointsTypeData = function() {
		return _.isEmpty(user.getAllAppointsTypeData());
	};
	
	/**
	 * Get all patient types list
	 * 
	 * @return array patient types list or empty array if null
	 */
	user.getAllPatientsTypeData = function() {
		var patienttypes = null;
		if (user.info.json_sync && user.info.json_sync.flextypes && user.info.json_sync.flextypes.patienttypes) {
			if (user.info.json_sync.flextypes.patienttypes['it']) {
				patienttypes = user.info.json_sync.flextypes.patienttypes['it'];
			} else {
				patienttypes = user.info.json_sync.flextypes.patienttypes;
			}
		}
		if (patienttypes) {
			return patienttypes;
		} else {
			return new Array();
		}
	};
	
	/**
	 * Get patient type data
	 * 
	 * @param string patientid doctor id
	 * @return mixed patient type data
	 */
	user.getPatientTypeData = function(patientcode) {
		var patienttypes = user.getAllPatientsTypeData();
		return  _.findWhere(patienttypes, {code: patientcode});
	};
	
	/**
	 * Get if patient types list is empty
	 * 
	 * @return boolean 
	 */
	user.isEmptyPatientsTypeData = function() {
		return _.isEmpty(user.getAllPatientsTypeData());
	};
	
	/**
	 * Get all doctor list
	 * 
	 * @return array doctor types list or empty array if null
	 */
	user.getAllDoctorsTypeData = function() {
		if (user.info.json_sync && user.info.json_sync.struct && user.info.json_sync.struct.doctors) {
			return user.info.json_sync.struct.doctors;
		} else {
			return new Array();
		}
	};
	
	/**
	 * Get doctor data
	 * 
	 * @param string doctorid doctor id
	 * @return mixed doctor data
	 */
	user.getDoctorTypeData = function(doctorid) {
		var arrtypes = user.getAllDoctorsTypeData();
		var temp = _.find(arrtypes, function(obj) {
			if (obj.id == doctorid) {
				return true;
			}
		});
		return temp;
	};
	
	/**
	 * Get if doctor types list is empty
	 * 
	 * @return boolean 
	 */
	user.isEmptyDoctorsTypeData = function() {
		return _.isEmpty(user.getAllDoctorsTypeData());
	};
	
	/**
	 * Get all studios list
	 * 
	 * @return array studios list or empty array if null
	 */
	user.getAllStudiosTypeData = function() {
		if (user.info.json_sync && user.info.json_sync.struct && user.info.json_sync.struct.N1) {
			var N1 = user.info.json_sync.struct.N1;
			var N2 = _.first(N1).N2;
			var N3 = _.first(N2).N3;
			var N4 = _.first(N3).N4;
			return N4;
		} else {
			return new Array();
		}
	};
	
	/**
	 * Get studio data
	 * 
	 * @param {string} studioid studio id
	 * @return {mixed} studio data
	 */
	user.getStudioTypeData = function(studioid) {
		var N4 = user.getAllStudiosTypeData();
		var temp = _.find(N4, function(obj) {
			if (obj.id == studioid) {
				return true;
			}
		});
		return temp;
	};
	
	/**
	 * Get signdoc list
	 * 
	 * @return mixed studio data
	 */
	user.getDocsignList = function() {
		return user.info.printdocs_gen;
	};
	
	/**
	 * Get if studios list is empty
	 * 
	 * @return boolean 
	 */
	user.isEmptyStudiosTypeData = function() {
		return _.isEmpty(user.getAllStudiosTypeData());
	};
	
	/**
	 * Create on server a setting parameter
	 * 
	 * @param {string} paramType parameter name
	 * @param {string} paramObj object setting
	 * @param {function} callback
	 */
	user.createUserSetting = function(paramType, paramObj, callback) {
		var xsrf = $.param({
			type: paramType,
			jsonobj: JSON.stringify(paramObj)
		});
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/users/createUserSetting',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data) {
			App.checkUserSession(data);
			if (data.ack) {
				callback(true);
			} else {
				callback(false);
				Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), $translate('USER.ERR.USERPARAMCHANGEFAIL'));
			}
		}).error(function() {
			callback(false);
			Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), $translate('GENERAL.ERR.SERVERFAIL'));
		});
	};

	/**
	 * Update on server a parameter in json admin data
	 * 
	 * @param {string} paramname parameter name
	 * @param {string} paramsection section in which the parameter is
	 * @param {object} elem new value for the parameter
	 * @param {function} callback
	 */
	user.updateJsonAdminParam = function(paramname, paramsection, elem) {
		user.info.json_admin[paramsection][paramname] = elem;
	};
	
	/**
	 * Update on server all the json admin data
	 * 
	 * @param {function} callback
	 */
	user.updateJsonAdmin = function(callback) {
		var xsrf = $.param({
			json_admin: JSON.stringify(user.info.json_admin)
		});
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/users/updateJsonAdmin',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data) {
			App.checkUserSession(data);
			if (data.ack) {
				user.getUserInfo(function() {
					callback(true);
				});
			} else {
				callback(false);
				Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), $translate('USER.ERR.USERPARAMCHANGEFAIL'));
			}
		}).error(function() {
			callback(false);
			Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), $translate('GENERAL.ERR.SERVERFAIL'));
		});
	};
	
	/**
	 * Get all news
	 * 
	 */
	user.getAllNews = function(callback) {
		var xsrf = $.param({
			lang: user.lang,
			platform: 'web'
		});
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/sync/getAllNews',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data) {
			App.checkUserSession(data);
			if (data.ack) {
				user.news = data.payload;
				callback(true, null, data.payload);
			} else {
				callback(false, $translate('GENERAL.USER.GETNEWSFAIL'), null);
			}
		}).error(function() {
			callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	
	return user;
}]);
