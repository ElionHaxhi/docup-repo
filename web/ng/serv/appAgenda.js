var appAgenda = angular.module('appAgenda', []);

appAgenda.factory('Agenda', ['$http', '$location', '$translate', '$analytics', 'App', 'User', 'Config', 'Gendialog',
	function($http, $location, $translate, $analytics, App, User, Config, Gendialog) {
	
	var agenda = {
		currdate: new Date(),
		list: new Array(),
		obj: {},
		def: {},
		worklist: new Array(),
		typeheadList: new Array(),
		config: null,
		viz: {
			write: false
		}
	};
	
	/**
	 * Get patient details
	 * 
	 * @return boolean true if agenda is loaded
	 */
	agenda.checkAgendaListIsLoaded = function() {
		if (agenda && agenda.list) {
			return true;
		} else {
			return false;
		}
	};
	
	/**
	 * Prepare the default values for the agenda (like the default durationr for a new appointment)
	 * 
	 */
	agenda.prepareAgendaDefaults = function() {
		agenda.def.appduration = User.info.json_admin.agenda.appointduration;
		if (agenda.def.appduration) {
			var slotarr = agenda.def.appduration.split(":");
    		agenda.def.appdurationminutes = parseInt(slotarr[0] * 60) + parseInt(slotarr[1]);	
		}
    	agenda.def.starthour = parseInt(User.info.json_admin.agenda.starthour);
    	agenda.def.endhour = parseInt(User.info.json_admin.agenda.endhour);
    	if (User.info.json_admin.agenda.slotduration) {
    		agenda.def.slotduration = parseInt(User.info.json_admin.agenda.slotduration);
    	} else {
    		agenda.def.slotduration = 30;
    	}
    	if (User.info.json_admin.agenda.weekendviz == 'SAT') {
    		agenda.def.hiddendays = [0];
    	} else if (User.info.json_admin.agenda.weekendviz == 'NO') {
    		agenda.def.hiddendays = [0, 6];
    	} else {
    		agenda.def.hiddendays = null;
    	}
	};
	
	/**
	 * Clear agenda data
	 * 
	 */
	agenda.clearAgendaObj = function() {
		agenda.obj = {};
		if (agenda.def.appduration) {
			agenda.obj.duration = agenda.def.appduration;
		}
	};
	
	/**
	 * Get the agenda data 
	 * 
	 * @param date startdate the day the agenda start
	 * @param date enddate the day the agenda end
	 * @param array doctorsFilter list of doctors to filter the agenda
	 * @param array studioFilter list of studios to filter the agenda
	 * @param array apptypeFilter list of appoint type to filter the agenda
	 * @param function callback
	 */
	agenda.getMonthAgendaByDate = function(startdate, enddate, doctorsFilter, studiosFilter, apptypesFilter, callback) {
		// prepare start and end dates
		startdate = moment(startdate).format('YYYY-MM-DD');
		enddate = moment(enddate).format('YYYY-MM-DD');
		// prepare doctors filter
		var alltrue = _.every(doctorsFilter, function(elem) {
			return elem;
		});
		if (alltrue) {
			doctorsFilter = null;
		} else {
			doctorsFilter = JSON.stringify(doctorsFilter);
		}
		// prepare studios filter
		var alltrue = _.every(studiosFilter, function(elem) {
			return elem;
		});
		if (alltrue) {
			studiosFilter = null;
		} else {
			studiosFilter = JSON.stringify(studiosFilter);
		}
		// prepare apptypes filter
		var alltrue = _.every(apptypesFilter, function(elem) {
			return elem;
		});
		if (alltrue) {
			apptypesFilter = null;
		} else {
			apptypesFilter = JSON.stringify(apptypesFilter);
		}
		// prepare params
		var xsrf = $.param({
			startdate: startdate,
			enddate: enddate,
			doctorsfilter: doctorsFilter,
			studiosfilter: studiosFilter,
			apptypesfilter: apptypesFilter
		});
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/appoints/getAllFromDateToDateFiltered',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		    cache: false
		}).success(function(data, status, headers, config) {
			App.checkUserSession(data);
			if (data.ack) {
				var cal = data.payload;
				//set the counter appoint to limit the appoint number per month for free license
				User.counters.appoint = _.size(data.payload);
				var events = Array();
				_.each(cal, function(elem, index) {
					var flagerr = false;
					var newevent = {
						allDay: false
					};
					// prepare other properties
					if (elem.appointid) {
						newevent.id = elem.appointid;
					} else {
						flagerr = true;
					}
					// in case patientid is present add the patient name to the title (disabled for the moment because causes duplicate titles)
					newevent.title = '';
					// if (elem.fk_patient) {
						// newevent.fk_patient = elem.fk_patient;
						// if (elem.lastname && _.isString(elem.lastname) ) {
							// newevent.lastname = elem.lastname;
						// } else {
							// newevent.lastname = null;
						// }
						// if (elem.firstname && _.isString(elem.firstname) ) {
							// newevent.firstname = elem.firstname;
						// } else {
							// newevent.firstname = null;
						// }
					// } else {
						// newevent.patientid = null;
					// }
					// prepare appoint title
					if (elem.title && _.isString(elem.title) ) {
						newevent.title = newevent.title + elem.title;
					}
					// prepare start datetime appoint
					if (elem.startdatetime) {
						newevent.startmoment = moment(elem.startdatetime);
						newevent.start = newevent.startmoment.toDate();
						newevent.startstr = newevent.startmoment.format('DD/MM/YYYY HH:mm:ss');
					} else {
						flagerr = true;
					}
					// prepare end datetime appoint
					if (elem.enddatetime) {
						newevent.endmoment = moment(elem.enddatetime);
						newevent.end = newevent.endmoment.toDate();
						newevent.endstr = newevent.endmoment.format('DD/MM/YYYY HH:mm:ss');
					}
					// prepare appoint type object
					newtype = User.getAppointTypeData(elem.type);
					if (newtype) {
						newevent.type = newtype;
						newevent.color = newtype.color;
					} else {
						newevent.type = null;
					}
					// prepare appoint doctor obj
					// newdoctype = User.getDoctorTypeData(elem.fk_doct);
					// if (newdoctype) {
						// newevent.doctype = newdoctype;
					// } else {
						// newevent.doctype = null;
					// }
					// prepare appoint studio obj
					// newstudiotype = User.getStudioTypeData(elem.fk_studio);
					// if (newstudiotype) {
						// newevent.studiotype = newstudiotype;
					// } else {
						// newevent.studiotype = null;
					// }
					// add to the event array
					if (!flagerr) {
						events.push(newevent);
					}
				});
				agenda.list = events;
				if (callback) {
					callback(events);
				}
			} else {
				Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), $translate('AGENDA.ERR.AGENDAMONTHGETFAIL'));
			}
		}).error(function(data, status, headers, config) {
			Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), $translate('GENERAL.ERR.SERVERFAIL'));
		});
	};
	
	/**
	 * Get appoint details
	 * 
	 * @param string appointid appoint guid
	 * @param function callback
	 */
	agenda.getAppointDetails = function(appointid, callback) {
		var xsrf = $.param({
			id: appointid
		});
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/appoints/get',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data, status, headers, config) {
			App.checkUserSession(data);
			if (data.ack && data.payload) {
				// prepare patient object
				agenda.clearAgendaObj();
				agenda.obj = angular.copy(data.payload);
				// prepare duration
				var startmoment = moment(data.payload.startdatetime);
				var endmoment = moment(data.payload.enddatetime);
				var diffmoment = endmoment.diff(startmoment);
				durationmoment = moment.duration(diffmoment);
				agenda.obj.duration = durationmoment.hours() + ':' + durationmoment.minutes();
				// prepare start date
				var startdatetime = moment(agenda.obj.startdatetime);
				agenda.obj.start = startdatetime.format('YYYY-MM-DD HH:mm');
				// callback
				callback(true, null, data.payload);
			} else {
				callback(false, data.message, null);
			}
		}).error(function(data, status, headers, config) {
			callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	
	/**
	 * Update appoint star (used when you move an appoint in fullcalendar)
	 * 
	 * @param object event
	 * @param dayDelta (not used)
	 * @param minuteDelta (not used)
	 * @param function callback
	 */
	agenda.updateAppointDatetime = function(event, dayDelta, minuteDelta, callback) {
		// the event passed has already the new start and end dates, it is necessary only to calculate the new strings
		// prepare the new start date
		var newstartstr = event.startmoment.format('YYYY-MM-DD HH:mm:ss');
		// prepare the new end date time
		var newendstr = event.endmoment.format('YYYY-MM-DD HH:mm:ss');
		var xsrf = $.param({
			id: event.id,
			startdatetime: newstartstr,
			enddatetime: newendstr
		});
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/appoints/updateDatetime',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function(data, status, headers, config) {
			App.checkUserSession(data);
			if (data.ack) {
				// the write is successful so update local end date elements
				event.startstr = newstartstr;
				// the write is successful so update local end date elements
				event.endstr = newendstr;
				callback(event, true);
			} else {
				callback(null, false);
			}
		}).error(function(data, status, headers, config) {
			callback(null, false);
		});
	};
	
	/**
	 * Update appoint duration (used when you drag a new duration in fullcalendar)
	 * 
	 * @param object event
	 * @param dayDelta duration in days between the old and new appoint
	 * @param minuteDelta duration in minutes between the old and new appoint
	 * @param function callback
	 */
	agenda.updateAppointDuration = function(event, dayDelta, minuteDelta, callback) {
		// prepare the new end date time
		var newendmoment = event.endmoment.add('minutes', minuteDelta);
		var newend = newendmoment.format('YYYY-MM-DD HH:mm:ss');
		// prepare the new duration
		var appduration = event.endmoment.diff(event.startmoment);
		appduration = moment.duration(appduration);
		var newduration = appduration.asHours();
		var newdurationfixed = newduration.toFixed(2);
		// prepare post message
		var xsrf = $.param({
			id: event.id,
			enddatetime: newend
		});
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/appoints/updateDuration',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function(data, status, headers, config) {
			App.checkUserSession(data);
			if (data.ack) {
				// the write is successful so update local duration elements
				event.duration = parseFloat(newdurationfixed);
				event.durationmoment = moment.duration(event.duration, 'hours');
				event.durationstr = event.durationmoment.hours() + ':' + event.durationmoment.minutes();
				// the write is successful so update local end date elements
				event.endmoment = newendmoment;
				event.end = event.endmoment.toDate();
				event.endstr = newend;
				callback(event, true);
			} else {
				callback(null, false);
			}
		}).error(function(data, status, headers, config) {
			callback(null, false);
		});
	};
	
	/**
	 * Create a new appoint
	 * 
	 * @param function callback
	 */
	agenda.createAppointDetails = function(callback) {
		var saveobj = angular.copy(agenda.obj);
		delete(saveobj.patientobj);
		// prepare duration
		var splitdur = saveobj.duration.split(':');
		// var duration = moment.duration({hours: splitdur[0], minutes: splitdur[1]});
		// prepare appdatetime start
		var start = moment(saveobj.start, 'YYYY-MM-DD HH:mm');
		saveobj.startdatetime = start.format('YYYY-MM-DD HH:mm:ss');
		// prepare appdatetime end
		var end = start.add('hours', splitdur[0]);
		var end = end.add('minutes', splitdur[1]);
		saveobj.enddatetime = end.format('YYYY-MM-DD HH:mm:ss');
		// send post
		var xsrf = $.param(saveobj);
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/appoints/create',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data, status, headers, config) {
			App.checkUserSession(data);
			if (data.ack) {
				$analytics.eventTrack('AgendaEdit', {  type: 'create', trigger: null });

				callback(true, null, data.payload);
			} else {
				callback(false, $translate('AGENDA.ERR.CREATEAPPOINTFAIL'), null);
			}
		}).error(function(data, status, headers, config) {
			callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	
	/**
	 * Update appoint details
	 * 
	 * @param function callback
	 */
	agenda.updateAppointDetails = function(callback) {
		var saveobj = angular.copy(agenda.obj);
		delete(saveobj.patientobj);
		// prepare duration
		var splitdur = saveobj.duration.split(':');
		// prepare appdatetime start
		var start = moment(saveobj.start, 'YYYY-MM-DD HH:mm');
		saveobj.startdatetime = start.format('YYYY-MM-DD HH:mm:ss');
		// prepare appdatetime end
		var end = start.add('hours', splitdur[0]);
		var end = end.add('minutes', splitdur[1]);
		saveobj.enddatetime = end.format('YYYY-MM-DD HH:mm:ss');
		var xsrf = $.param(saveobj);
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/appoints/update',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data, status, headers, config) {
			App.checkUserSession(data);
			if (data.ack) {
				callback(true, null, data.payload);
			} else {
				callback(false, $translate('AGENDA.ERR.APPOINTCHANGEFAIL'), null);
			}
		}).error(function(data, status, headers, config) {
			callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	
	/**
	 * Delete appoint
	 * 
	 * @param function callback
	 */
	agenda.deleteAppoint = function(callback) {
		var xsrf = $.param({
			id: agenda.obj.id
		});
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/appoints/delete',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data, status, headers, config) {
			App.checkUserSession(data);
			if (data.ack) {
				callback(true, null, data.payload);
			} else {
				callback(false, $translate('AGENDA.ERR.DELETEAPPOINTFAIL'), null);
			}
		}).error(function(data, status, headers, config) {
			callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	
	// /**
	 // * Get all patients filtered to create a new appoint for a patient
	 // * 
	 // * @param string filter
	 // * @param function callback
	 // */
	// agenda.getAllPatientNamesFiltered = function(filter, callback) {
		// var xsrf = $.param({
			// filter: filter
		// });
		// $http({
		    // method: 'POST',
		    // url: Config.base_url + Config.api_version + '/appoints/getAllPatientsNamesFiltered',
		    // data: xsrf,
		    // headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		// }).
		// success(function(data, status, headers, config) {
			// App.checkUserSession(data);
			// if (data.ack) {
				// callback(true, data.payload);
			// } else {
				// callback(false, null);
			// }
		// }).error(function(data, status, headers, config) {
			// callback(false, null);
		// });
	// };
	
	// /**
	 // * Get all patients filtered used in typehead (implemented as promise)
	 // * 
	 // * @param {string} filter
	 // */
	// agenda.getAllPatientNamesFilteredPromise = function(filter) {
		// var xsrf = $.param({
			// filter: filter
		// });
		// return $http({
		    // method: 'POST',
		    // url: Config.base_url + Config.api_version + '/patients/getAllNamesFiltered',
		    // data: xsrf,
		    // headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		// }).
		// then(function(resp) {
			// if (resp.data.ack) {
				// agenda.typeheadList = resp.data.payload;
				// return resp.data.payload;
			// } else {
				// agenda.typeheadList = new Array();
			// }
		// });
	// };
	
	/**
	 * Get the worklist
	 * 
	 * @param function callback
	 */
	agenda.getWorklist = function(limitFilter, doctorFilter, studioFilter, callback) {
		var xsrf = $.param({
			limit: limitFilter,
			doctor: doctorFilter,
			studio: studioFilter
		});
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/appoints/getWorklist',
		    data: xsrf,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).
		success(function(data, status, headers, config) {
			App.checkUserSession(data);
			if (data.ack) {
				agenda.worklist = data.payload;
				callback(true, null, data.payload);
			} else {
				callback(false, $translate('AGENDA.ERR.GETWORKLISTFAIL'), null);
			}
		}).error(function(data, status, headers, config) {
			callback(false, $translate('GENERAL.ERR.SERVERFAIL'), null);
		});
	};
	
	/**
	 * Get an html string with the print of the worklist
	 * 
	 */
	agenda.printWorklist = function() {
		var worklistjson = JSON.stringify(agenda.worklist);
		var xsrf = $.param({
			worklist: worklistjson
		});
		$http({
		    method: 'POST',
		    url: Config.base_url + Config.api_version + '/appoints/printWorklist',
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
	
	return agenda;
}]);

/*
 * Google calendar
 */
appAgenda.factory('CalendarData', function($q, $log) {
	var self = {};

	// gets the calendar list from Google
	self.getCalendars = function() {
		var deferred = $q.defer();
		var request = gapi.client.calendar.calendarList.list();
		request.execute(function(resp) {
			$log.debug("CalendarData.getCalendars response %O", resp);
			deferred.resolve(resp.items);
		});
		return deferred.promise;
	};

	// fetches events from a particular calendar
	// start and end dates (optional) must be RFC 3339 format 
	self.getEvents = function(calendarId, start, end) {
		var deferred = $q.defer();
		if (gapi_helper.status.calendarLoaded) {
			var request = gapi.client.calendar.events.list({
				calendarId: calendarId,
				timeMin: start,
				timeMax: end,
				maxResults: 10000, // max results causes problems: http://goo.gl/FqwIFh
				singleEvents: true
			});
			request.execute(function(resp) {
	        	$log.debug("CalendarData.getEvents response %O", resp);
	        	deferred.resolve(resp.items || []);
	       	});
       	} else {
       		deferred.reject([]);
       	}
       	return deferred.promise;
	};

	return self;
	
});

appAgenda.factory("EventSourceFactory", function($q, CalendarData) {
	var self = {};

	self.eventCache = {};
	// if cached data is older than this, don't display it; wait for server data
	self.displayableTime = 1000 * 60 * 10; // 10 minutes
	// if cached data is younger than this, don't bother hitting the server at all
	self.noUpdateTime = 1000 * 60; // 60 seconds
	// (if age falls inbetween, display cached, then query server in the bg to update cache)

	// converts unix timestamp to Google API date format (RFC 3339)
	self.ts2googleDate = function(ts) {
	  return $.fullCalendar.formatDate($.fullCalendar.parseDate(ts), 'u');
	};
	
	// reformats events from Google's API into an object fullcalendar can use
	self.google2fcEvent = function(google) {
		var fc = {
			title: google.summary,
			start: google.start.date || google.start.dateTime,
			end: google.end.date || google.end.dateTime,
			allDay: google.start.date ? true : false,
			google: google // keep a reference to the original
	    };
		if (fc.allDay) {
			// subtract 1 from end date: Google all-day end dates are exclusive
			// FullCalendar's are inclusive
			var end = $.fullCalendar.parseDate(fc.end);
			end.setDate(end.getDate() - 1);
			fc.end = $.fullCalendar.formatDate(end, 'yyyy-MM-dd');
		}
		return fc;
	};

	// fetches events from Google
	// callback is called with the results when they arrive
	self.fetchEvents = function(calendarId, start, end, callback) {
		start = self.ts2googleDate(start);
		end = self.ts2googleDate(end);
		CalendarData.getEvents(calendarId, start, end).then(function(result) {
			callback(result.map(self.google2fcEvent));
		});
	};

	// gets events, possibly from the cache if it's not stale
	self.getEvents = function(calendarId, start, end, callback) {
		var key = calendarId + '|' + start + '|' + end;
		var cached = self.eventCache[key];
		var now = new Date();
		var displayCached = false,
			updateCache = true;
		if (cached) {
			var age = new Date().getTime() - cached.date.getTime();
			displayCached = age <= self.displayableTime;
			updateCache = age > self.noUpdateTime;
		}
		// cached data is ok to display? then display it
		if (displayCached) {
			callback(cached.data);
		}
		// do we need to update the cache with fresh data from Google?
		if (updateCache) {
			self.fetchEvents(calendarId, start, end, function(data) {
				self.eventCache[key] = {
					date: new Date(),
					data: data
				};
				// display the fresh data if we didn't display the cached data
				if (!displayCached) callback(data);
			});
		}
	};

	// converts a calendar object from Google's API to a fullcalendar event source
	self.google2fcEventSource = function(calendar) {
		return {
			events: function(start, end, callback) {
				self.getEvents(calendar.id, start, end, callback);
			},
			textColor: calendar.foregroundColor,
			color: calendar.backgroundColor,
			google: calendar // keep a reference to the original
		};
	};

	// gets event sources for all calendars in the user's Google account
	self.getEventSources = function() {
		var deferred = $q.defer();
		CalendarData.getCalendars().then(function(result) {
			if (result) {
				sources = result.map(self.google2fcEventSource);
				deferred.resolve(sources);
			}
		}, function(error) {
			$scope.$log("EventSourceFactory.getEventSources error %O", error);
			deferred.reject(error);
		});
		return deferred.promise;
	};

	return self;

});
