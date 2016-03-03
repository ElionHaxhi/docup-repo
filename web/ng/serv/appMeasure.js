var appMeasure = angular.module('appMeasure', []);

appMeasure.factory('Measure', ['$http', '$location', '$translate', '$analytics', 'App', 'Config', 'Gendialog', 'User', 'Flexschema', 'Flexmodel',
	function($http, $location, $translate, $analytics, App, Config, Gendialog, User, Flexschema, Flexmodel) {

		var measure = {
			summary: {
				list: []
			},
			lists: {},
			graphs: {},
			obj: {},
			patientid: null,
			backup: null,
			filter: {
				examtype: null,
				valtype: null
			},
			viz: {
				write: false,	// apre pagina in lettura o scrittura
				create: false,	// apre pagina per creare o modificare un paziente
				currTable: null,
				navDetail: false
			},
			graphopts: {
				series: {
					lines: 	{ show: true },
					points: { show: true },
					bars: 	{ show: false }
				},
				grid: {
					margin: 20,
					borderColor: '#000000',
					borderWidth: {
						top: 0,
						bottom: 1,
						left: 0,
						right: 0
					},
					autoHighlight: true
				},
				yaxis: {
					show: true,
					color: '#f2f2f2',
					tickColor: '#f1f1f1'
				},
				xaxis: {
					show: true,
					mode: "time",
					timeformat: "%d/%m",
					minTickSize: [1, 'hour'],
					maxTickSize: [1, 'year'],
					autoscaleMargin: 0.02
				}
			},
			lastflexschema:  null
		};

		measure.writeState = function(state) {
			measure.viz.write = state;
			return true;
		};

		measure.createState = function(state) {
			measure.viz.create = state;
			return true;
		};

		measure.backupRecord = function(copy) {
			measure.backup = copy;
			return true;
		};

		measure.checkWriteState = function() {
			return measure.viz.write;
		};

		measure.checkCreateState = function() {
			return measure.viz.create;
		};

		/**
		 * Check if an record backup is setup
		 *
		 */
		measure.checkBackupRecord = function() {
			return measure.backup;
		};

		/**
		 * Check if an record is loaded
		 *
		 */
		measure.checkRecordIsLoaded = function() {
			return (!_.isEmpty(measure) && !_.isEmpty(measure.obj) && !_.isEmpty(measure.obj.id));
		};

		/**
		 * Clear record list data
		 *
		 */
		measure.clearRecordList = function() {
			measure.summary.list = [];
			measure.lists = {};
			measure.graphs = {};
		};

		/**
		 * Clear record data
		 *
		 */
		measure.clearRecordObj = function() {
			measure.obj = {
				jsondata: {}
			};
		};

		/**
		 * Get all active records for the user
		 *
		 * @param {string} patientid
		 * @param {string} rectype
		 * @param {function} callback
		 */
		measure.getAllRecordsByPatientId = function(patientid, rectype, callback) {
			var xsrf = $.param({
				patientid: patientid,
				rectype: rectype,
				filtertype: null
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
						var record_list = data.payload;

						var avail_flexforms = angular.copy(Flexschema.flex.available.measure);

						measure.lists = {};
						measure.graphs = {};

						_.each(record_list, function(elem){
							var flexform = Flexschema.flex.downloaded.measure[elem.jsondata_type];

							// create record lists
							var listRow = {};

							Flexmodel.setFlexProperties(flexform.properties);
							Flexmodel.setFlexModel(JSON.parse(elem.jsondata));

							listRow.id 			= elem.id;
							listRow.description = flexform.description;
							listRow.props 		= Flexmodel.getKeyvals();
							listRow.dbname 		= elem.jsondata_type;
							listRow.examdate 	= elem.examdate;
							listRow.jsondata 	= elem.jsondata;

							if(!measure.lists[elem.jsondata_type]){
								measure.lists[elem.jsondata_type] = [];
								measure.lists[elem.jsondata_type].push(listRow);
							}
							else{
								measure.lists[elem.jsondata_type].push(listRow);
							}

							//create record graphs
							Flexmodel.setFlexProperties(flexform.properties);
							Flexmodel.setFlexModel(JSON.parse(elem.jsondata));

							if(!measure.graphs[elem.jsondata_type]){
								measure.graphs[elem.jsondata_type] = [];
								_.each(Flexmodel.getKeyvals(), function(prop){
									measure.graphs[elem.jsondata_type].push({
										"title": flexform.description,
										"label": prop.descr,
										"shadowSize": 0,
										"data": []
									});
								});
							}

							_.each(Flexmodel.getKeyvals(), function(prop){
								var currEl = _.findWhere(measure.graphs[elem.jsondata_type], {label: prop.descr});
								var tick = moment(elem.examdate, 'YYYY-MM-DD HH:mm:ss').valueOf();
								currEl['data'].push([tick, prop.val]);
							});
						});

						for(var graphindex in measure.graphs) {
							for(var dataindex in measure.graphs[graphindex]) {
								measure.graphs[graphindex][dataindex].data = _.sortBy(measure.graphs[graphindex][dataindex].data, function(point){ return point[0]; });
							}
						}

						measure.summary.list = [];
						_.each(avail_flexforms, function(elem){
							var flexform = Flexschema.flex.downloaded.measure[elem.dbname];

							var summaryRow = {};

							summaryRow.description 	= flexform.description;
							summaryRow.dbname 		= elem.dbname;

							if(measure.lists[elem.dbname]){
								Flexmodel.setFlexProperties(flexform.properties);
								Flexmodel.setFlexModel(JSON.parse(measure.lists[elem.dbname][0]['jsondata']));

								summaryRow.lastValue 	= Flexmodel.getKeyvals();
								summaryRow.active 		= true;
								summaryRow.examdate 	= measure.lists[elem.dbname][0]['examdate'];

								//diff
								if(measure.lists[elem.dbname][1]){
									Flexmodel.setFlexModel(JSON.parse(measure.lists[elem.dbname][1]['jsondata']));
									var prevValue = Flexmodel.getKeyvals();
									_.each(summaryRow.lastValue, function(currVal){
										var currDiffPerc = _.findWhere(prevValue, {id: currVal.id});
										currVal.percDiff = parseFloat((-((parseFloat(currDiffPerc.val) - parseFloat(currVal.val))) / parseFloat(currDiffPerc.val)) * 100);
									});
								}

							}
							else{
								summaryRow.lastValue 	= [];
								summaryRow.active 		= false;
								summaryRow.examdate 	= null;
							}

							measure.summary.list.push(summaryRow);

						});

						measure.graphs 			= _.sortBy(measure.graphs, function(graph){ return graph[0].title; });
						measure.lists 			= _.sortBy(measure.lists, function(list){ return list[0].title; });
						measure.summary.list 	= _.sortBy(measure.summary.list, function(list){ return list.description; });

						// call the callback if present
						if (_.isFunction(callback)) callback(true, null, data.payload);
					} else {
						if (_.isFunction(callback)) callback(false, $translate('MEASURE.ERR.GETMEASURESFAIL'), null);
					}
				}).error(function() {
					if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
				});
		};

		/**
		 * Get all details for an record
		 *
		 * @param {string} measureid
		 * @param {function} callback [optional]
		 */
		measure.getRecordDetails = function(measureid, callback) {
			measure.viz.write = false;
			measure.viz.create = false;

			var xsrf = $.param({
				id: measureid
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
						// prepare record object
						measure.clearRecordObj();
						if (!_.isObject(data.payload.jsondata)) {
							data.payload.jsondata = {};
						}
						measure.obj = angular.copy(data.payload);
						// set info for flexform of the record
						if (measure.obj.jsondata_type) {
							measure.obj.flexformname = Flexschema.getFlexformDescrFromDbname(measure.obj.jsondata_type);
						}
						// prepare viz
						measure.createState(false);
						measure.writeState(false);
						// once the patient is ready call the callback if present
						if (_.isFunction(callback)) callback(true, null, data.payload);
					} else {
						if (_.isFunction(callback)) callback(false, $translate('MEASURE.ERR.GETMEASUREFAIL'), null);
					}
				}).error(function() {
					if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
				});
		};

		/**
		 * Get the last record to populate the new record form
		 *
		 * @param {string} type record type
		 * @param {string} patientid
		 * @param {function} callback [optional] callback function
		 */
		measure.getLastRecordByType = function(patientid, type, callback) {
			var xsrf = $.param({
				examtype: type,
				rectype: "VAL",
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
						measure.clearRecordObj();
						if (!_.isObject(data.payload.jsondata)) {
							data.payload.jsondata = {};
						}
						measure.obj = angular.copy(data.payload);
						if (_.isFunction(callback)) callback(true, null, data.payload);
					} else {
						measure.obj.jsondata = {};
						if (_.isFunction(callback)) callback(false, $translate('MEASURE.ERR.GETMEASUREFAIL'), null);
					}
				}).error(function() {
					if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
				});
		};

		/**
		 * Create new record with the data in the model
		 *
		 * @param {string} patientid
		 * @param {string} rectype
		 * @param {function} callback
		 */
		measure.createRecordDetails = function(patientid, rectype, callback) {
			var saveobj = angular.copy(measure.obj);

			if (_.isEmpty(saveobj.jsondata)) {
				saveobj.jsondata = null;
			} else {
				saveobj.jsondata = JSON.stringify(saveobj.jsondata);
			}

			saveobj.jsondata_type = Flexschema.flex.current.measure.measure_flexform;

			saveobj.fk_patient = patientid;
			saveobj.rectype = rectype;

			var xsrf = $.param(saveobj);
			$http({
				method: 'POST',
				url: Config.base_url + Config.api_version + '/exams/create',
				data: xsrf,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).
				success(function(data) {
					App.checkUserSession(data);
					if (data.ack) {
						$analytics.eventTrack('MeasureEdit', {  type: 'create', flex: saveobj.jsondata_type });

						if (_.isFunction(callback)) callback(true, null, data.payload);
					} else {
						if (_.isFunction(callback)) callback(false, data.message, null);
					}
				}).error(function() {
					if (_.isFunction(callback)) callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
				});
		};

		/**
		 * Update record with the data in the model
		 *
		 * @param {function} callback
		 */
		measure.updateRecordDetails = function(callback) {
			var saveobj = angular.copy(measure.obj);
			if (_.isEmpty(saveobj.jsondata)) {
				saveobj.jsondata = null;
			} else {
				saveobj.jsondata = JSON.stringify(saveobj.jsondata);
			}
			saveobj.jsondata_type = Flexschema.flex.current.measure.measure_flexform;

			var xsrf = $.param(saveobj);
			$http({
				method: 'POST',
				url: Config.base_url + Config.api_version + '/exams/update',
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
		 * Delete record
		 *
		 * @param id unique record id
		 * @param callback
		 */
		measure.deleteRecord = function(id, callback) {
			var xsrf = $.param({
				id: id
			});
			$http({
				method: 'POST',
				url: Config.base_url + Config.api_version + '/exams/delete',
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
		 * Open new page with record print
		 *
		 * @param {string} id record id
		 */
		measure.printRecordDetails = function(id) {
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

		return measure;
	}
]);
