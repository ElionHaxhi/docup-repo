function agendaCtrl($location, $scope, $routeParams, $translate, App, Agenda, User, Gendialog, Navbar, Graphui, Flexschema, Patient, CalendarData, EventSourceFactory) {
	
	/*
	 * SCOPE
	 */
	$scope.user = User;
	$scope.agenda = Agenda;
	$scope.patient = Patient;
	$scope.appformats = App.params.formats;
	// to manage the small calendar
	$scope.selectedDate = new Date();
	// for filters management
	$scope.selectedDoctors = {};
	$scope.selectedStudios = {};
	$scope.selectedApptypes = {};
	$scope.typeheadLastname = null;
	// for the form management
	$scope.appointselected = false;
	// for the patient selection
	$scope.formctrl = {
		patientsearch: null,
		doctorsearch: null,
		studiosearch: null,
		apptypesearch: null
	};
	
	/*
	 * PRIV FUNCS
	 */
	var callbackAppointUpdate = function(event, ack) {
		if (!ack) {
			Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), $translate('AGENDA.ERR.APPOINTCHANGEFAIL'));
		} else {
			$scope.idoctCal.fullCalendar('renderEvent', event);
		}
		$scope.idoctCal.editable = true;
	};
	
	var callbackAppointSave = function(ack, msg, payload) {
		if (ack) {
			cleanAppointObj();
			$scope.idoctCal.fullCalendar('refetchEvents');
		} else {
			Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), msg);
		}
		//Graphui.setLoading(false);
	};
	
	var cleanAppointObj = function() {
		Agenda.clearAgendaObj();
		Agenda.viz.write = false;
	};
	
	/*
	 * PUB FUNCS
	 */
	
	/**
	  * Check if the form is enabled
	  * 
	  */
	$scope.checkFormEnabled = function() {
		return Agenda.viz.write;
	};
	
	/**
	  * Toggle the form open/close
	  * 
	  */
	$scope.toggleDetails = function() {
		Agenda.clearAgendaObj();
		Agenda.viz.write = !Agenda.viz.write;
	};
	
	/**
	  * Update agenda/appoint details
	  * 
	  */
	$scope.updateDetails = function() {
		var msgType = User.checkLicenseFreeLimit("APP");
		if (!msgType) {
			if ($scope.editAppointForm.$valid) {
				if (Agenda.obj.id) {
					////Graphui.setLoading(true);
					Agenda.updateAppointDetails(callbackAppointSave);
				} else {
					////Graphui.setLoading(true);
					Agenda.createAppointDetails(callbackAppointSave);
				}
			} else {
				$scope.formError = true;
				Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), $translate('GENERAL.FORM.FORMNOTVALID') + '. ' + $translate('GENERAL.FORM.FORMCHECKMANDATORY') + '.');
			}
		} else {
			Gendialog.openErrorLicenseFreeDialog(msgType);
		}
	};
	
	$scope.cleanFormObj = function() {
		Agenda.clearAgendaObj();
	};
	
	/**
	  * Select doctors methods
	  * 
	  */
	$scope.selectDoctorFilter = function(id) {
		$scope.selectedDoctors[id] = !$scope.selectedDoctors[id];
		$scope.idoctCal.fullCalendar('refetchEvents');
	};
	
	$scope.selectDoctorOnly = function(id) {
		_.each($scope.doctorscomp, function(elem, index) {
			$scope.selectedDoctors[elem.id] = false;
		});
		$scope.selectedDoctors[id] = true;
		$scope.idoctCal.fullCalendar('refetchEvents');
	};
	
	$scope.selectDoctorAll = function() {
		_.each($scope.doctorscomp, function(elem, index) {
			$scope.selectedDoctors[elem.id] = true;
		});
		if ($scope.idoctCal) {
			$scope.idoctCal.fullCalendar('refetchEvents');
		}
	};
	
	$scope.selectDoctorNoone = function() {
		_.each($scope.doctorscomp, function(elem, index) {
			$scope.selectedDoctors[elem.id] = false;
		});
		$scope.idoctCal.fullCalendar('refetchEvents');
	};
	
	$scope.checkDoctorFilter = function(id) {
		if ($scope.selectedDoctors[id]) {
			return true;
		} else {
			return false;
		}
	};
	
	/**
	  * Select studios methods
	  * 
	  */
	$scope.selectStudioFilter = function(id) {
		$scope.selectedStudios[id] = !$scope.selectedStudios[id];
		$scope.idoctCal.fullCalendar('refetchEvents');
	};
	
	$scope.selectStudioOnly = function(id) {
		_.each($scope.studioscomp, function(elem, index) {
			$scope.selectedStudios[elem.id] = false;
		});
		$scope.selectedStudios[id] = true;
		$scope.idoctCal.fullCalendar('refetchEvents');
	};
	
	$scope.selectStudioAll = function() {
		_.each($scope.studioscomp, function(elem, index) {
			$scope.selectedStudios[elem.id] = true;
		});
		if ($scope.idoctCal) {
			$scope.idoctCal.fullCalendar('refetchEvents');
		}
	};
	
	$scope.selectStudioNoone = function() {
		_.each($scope.studioscomp, function(elem, index) {
			$scope.selectedStudios[elem.id] = false;
		});
		$scope.idoctCal.fullCalendar('refetchEvents');
	};
	
	$scope.checkStudioFilter = function(id) {
		if ($scope.selectedStudios[id]) {
			return true;
		} else {
			return false;
		}
	};
	
	/**
	  * Select appoint types methods
	  * 
	  */
	$scope.selectApptypeFilter = function(code) {
		$scope.selectedApptypes[code] = !$scope.selectedApptypes[code];
		$scope.idoctCal.fullCalendar('refetchEvents');
	};
	
	$scope.selectApptypeOnly = function(code) {
		_.each($scope.apptypescomp, function(elem, index) {
			$scope.selectedApptypes[elem.code] = false;
		});
		$scope.selectedApptypes[code] = true;
		$scope.idoctCal.fullCalendar('refetchEvents');
	};
	
	$scope.selectApptypeAll = function() {
		_.each($scope.apptypescomp, function(elem, index) {
			$scope.selectedApptypes[elem.code] = true;
		});
		if ($scope.idoctCal) {
			$scope.idoctCal.fullCalendar('refetchEvents');
		}
	};
	
	$scope.selectApptypeNoone = function() {
		_.each($scope.apptypescomp, function(elem, index) {
			$scope.selectedApptypes[elem.code] = false;
		});
		$scope.idoctCal.fullCalendar('refetchEvents');
	};
	
	$scope.checkApptypeFilter = function(code) {
		if ($scope.selectedApptypes[code]) {
			return true;
		} else {
			return false;
		}
	};
	
	/**
	  * Prepare for the creation of a new appoint after selecting a patient
	  * 
	  * @param object patient
	  */
	$scope.createNewAppointForPatient = function(patient) {
		Agenda.obj.lastname = patient;
		Agenda.viz.write = true;
	};
	
	/**
	  * Load appoint
	  * 
	  * @param string appointid
	  */
	$scope.loadAppointById = function(appointid) {
		Agenda.getAppointDetails(appointid, function(ack, msg, payload) {
			if (ack) {
				if (Agenda.obj.fk_patient) {
					var currpatient = Patient.getPatientFromList(Agenda.obj.fk_patient);
					Agenda.obj.lastname = angular.copy(currpatient);
				} else {
					Agenda.obj.lastname = null;
				}
				Agenda.viz.write = true;
			}
		});
	};
	
	/**
	  * Open the dialog to confirm appoint delete
	  * 
	  */
	$scope.openDialogDeleteConfirm = function() {
		var dialogtitle = $translate('AGENDA.APPOINTDELCONFIRM_TITLE');
		var dialogmsg = $translate('AGENDA.APPOINTDELCONFIRM_QUEST');
		Gendialog.openConfirmDialog(dialogtitle, dialogmsg, $scope.deleteAppoint);
	};
	
	/**
	  * Delete appoint
	  * 
	  */
	$scope.deleteAppoint = function(callback) {
		if (callback) {
			Agenda.deleteAppoint(callback);
		} else {
			Agenda.deleteAppoint(callbackAppointSave);
		}
	};
	
	/*
	 * TYPEAHEADS
	 */
	
	/**
	 * One contact is selected from the typeahead
	 * 
	 */
	$scope.selectPatientTypeahead = function(t) {
		Agenda.obj.patientobj = t;
		if (t) {
			Agenda.obj.fk_patient = t.id;
			Agenda.obj.lastname = t.lastname;
			Agenda.obj.firstname = t.firstname;
		} else {
			Agenda.obj.fk_patient = null;
		}
	};
	
	/**
	 * One contact is deselected from the typeahead
	 * 
	 */
	$scope.deselectPatientTypeahead = function() {
		Agenda.obj.patientobj = null;
		Agenda.obj.fk_patient = null;
		Agenda.obj.lastname = null;
		Agenda.obj.firstname = null;
		$scope.$apply();
	};
	
	/*
	 * CALENDAR
	 */
	
	/**
	  * Refresh calendar
	  * 
	  */
	$scope.refreshCalendar = function() {
		$scope.idoctCal.fullCalendar('refetchEvents');
	};
	
	/**
	  * Refetch calendar from source
	  * 
	  * @param date start
	  * @param date end
	  * @param function callback
	  */
	$scope.eventsF = function (start, end, callback) {
		//console.log('refetch calendar');
		if (start && end) {
			$scope.lastcalstart = start;
			$scope.lastcalend = end;
		}
		Agenda.getMonthAgendaByDate($scope.lastcalstart, $scope.lastcalend, $scope.selectedDoctors, $scope.selectedStudios, $scope.selectedApptypes, callback);
    };
    
	/**
	  * On calendar day click
	  * 
	  * @param date date
	  * @param allDay boolean
	  * @param event jsEvent
	  * @param view
	  */
	$scope.eventOnDayClick = function(date, allDay, jsEvent, view) {
    	Agenda.obj.start = moment(date).format('YYYY-MM-DD HH:mm');
		Agenda.viz.write = true;
		$scope.$apply();
    };
    
    /**
	  * On calendar event click
	  * 
	  * @param event event
	  * @param event jsEvent
	  * @param view
	  */
	$scope.eventOnEventClick = function(event, jsEvent, view) {
		$scope.loadAppointById(event.id);
    	$scope.$apply();
    };
    
	/**
	  * On calendar event drop
	  * 
	  */
	$scope.eventOnDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
		$scope.idoctCal.editable = false;
		var msgType = User.checkLicenseFreeLimit("APP");
		if (!msgType) {
			Agenda.updateAppointDatetime(event, dayDelta, minuteDelta, callbackAppointUpdate);
		} else {
			$scope.idoctCal.fullCalendar('refetchEvents');
			Gendialog.openErrorLicenseFreeDialog(msgType);
		}
	};
    
    /**
	  * On calendar event resize
	  * 
	  */
    $scope.eventOnResize = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ){
    	$scope.idoctCal.editable = false;
    	var msgType = User.checkLicenseFreeLimit("APP");
		if (!msgType) {
			Agenda.updateAppointDuration(event, dayDelta, minuteDelta, callbackAppointUpdate);
		} else {
			$scope.idoctCal.fullCalendar('refetchEvents');
			Gendialog.openErrorLicenseFreeDialog(msgType);
		}
    };
    
    /**
	  * Change calendar view
	  * 
	  */
    $scope.changeView = function(view, calendar) {
		calendar.fullCalendar('changeView', view);
    };
    
    /*
	 * Google calendar
	 */
	
    // configure gapi-helper
	gapi_helper.configure({
		clientId: '1016510701517.apps.googleusercontent.com',
		apiKey: 'AIzaSyDiXgNeZOW5ZTWDEppiF-exh-ov6xM31N0',
		scopes: 'https://www.googleapis.com/auth/calendar',
		services: {
		  calendar: 'v3'
		}
	});
	
	// load calendars from google and pass them as event sources to fullcalendar
	$scope.loadSources = function() {
		EventSourceFactory.getEventSources().then(function(result) {
			$scope.eventSources = result;
			angular.forEach(result, function(source) {
				$scope.idoctCal.fullCalendar('addEventSource', source);
			});
		});
	};
  
   // load the event sources when the calendar api is loaded
	gapi_helper.when('calendarLoaded', $scope.loadSources);
    
    /*
	 * PREPARATIONS
	 */
	// prepare doctors filter
	$scope.doctorscomp = angular.copy(User.getAllDoctorsTypeData());
	$scope.selectDoctorAll();
	$scope.doctors = Flexschema.getFlexStyleDropdownFromList($scope.doctorscomp, 'name', 'id');

	// prepare studios filter
	$scope.studioscomp = angular.copy(User.getAllStudiosTypeData());
	$scope.selectStudioAll();
	$scope.studios = Flexschema.getFlexStyleDropdownFromList($scope.studioscomp, 'name', 'id');
	
	// prepare appoint types filter
	$scope.apptypescomp = angular.copy(User.getAllAppointsTypeData());
	$scope.selectApptypeAll();
	$scope.apptypes = Flexschema.getFlexStyleDropdownFromList($scope.apptypescomp, 'text', 'code');
    
    // prepare start hour
    if (User.info && User.info.json_admin && User.info.json_admin.agenda && User.info.json_admin.agenda.starthour) {
    	var agendastart = User.info.json_admin.agenda.starthour;
    } else {
    	var agendastart = '08:00';
    }
    // check security
    var editablecal = true;
    if (User.security && User.security.agenda && User.security.agenda.update && User.security.agenda.update === false) {
    	editablecal = false;
    }
    // config calendar
    // if ($location.path() === '/agenda/refresh/') {
    	//console.log(Agenda.def);
		//console.log('config calendar');
		$scope.uiConfig = {
			calendar:{
				defaultView: 'agendaWeek',
		        dayClick: $scope.eventOnDayClick,
		        eventClick: $scope.eventOnEventClick,
		        eventDrop: $scope.eventOnDrop,
		        eventResize: $scope.eventOnResize,
		        aspectRatio: 1.6,
		        editable: editablecal,
		        header:{
		          left: 'month agendaWeek agendaDay',
		          center: 'title',
		          right: 'today prev,next'
		        },
		        monthNames: [$translate('AGENDA.MONTHS.JAN'), $translate('AGENDA.MONTHS.FEB'), $translate('AGENDA.MONTHS.MAR'), $translate('AGENDA.MONTHS.APR'), 
		        	$translate('AGENDA.MONTHS.MAY'), $translate('AGENDA.MONTHS.JUN'), $translate('AGENDA.MONTHS.JUL'), $translate('AGENDA.MONTHS.AUG'), 
		        	$translate('AGENDA.MONTHS.SEP'), $translate('AGENDA.MONTHS.OCT'), $translate('AGENDA.MONTHS.NOV'), $translate('AGENDA.MONTHS.DEC')],
		        monthNamesShort: [$translate('AGENDA.MONTHS.JANSHORT'), $translate('AGENDA.MONTHS.FEBSHORT'), $translate('AGENDA.MONTHS.MAR'), $translate('AGENDA.MONTHS.APRSHORT'), 
		        	$translate('AGENDA.MONTHS.MAYSHORT'), $translate('AGENDA.MONTHS.JUNSHORT'), $translate('AGENDA.MONTHS.JULSHORT'), $translate('AGENDA.MONTHS.AUGSHORT'), 
		        	$translate('AGENDA.MONTHS.SEPSHORT'), $translate('AGENDA.MONTHS.OCTSHORT'), $translate('AGENDA.MONTHS.NOVSHORT'), $translate('AGENDA.MONTHS.DECSHORT')],
		        dayNames: [$translate('AGENDA.WEEK.SUN'), $translate('AGENDA.WEEK.MON'), $translate('AGENDA.WEEK.TUE'), $translate('AGENDA.WEEK.WED'), 
		        	$translate('AGENDA.WEEK.THU'), $translate('AGENDA.WEEK.FRI'), $translate('AGENDA.WEEK.SAT')],
		        dayNamesShort: [$translate('AGENDA.WEEK.SUNSHORT'), $translate('AGENDA.WEEK.MONSHORT'), $translate('AGENDA.WEEK.TUESHORT'), $translate('AGENDA.WEEK.WEDSHORT'), 
		        	$translate('AGENDA.WEEK.THUSHORT'), $translate('AGENDA.WEEK.FRISHORT'), $translate('AGENDA.WEEK.SATSHORT')],
		        buttonText: {
				    today: $translate('AGENDA.TODAY'),
				    month: $translate('AGENDA.MONTHNAME'),
				    week: $translate('AGENDA.WEEKNAME'),
				    day: $translate('AGENDA.DAYNAME')
				},
				allDaySlot: false,
				allDayText: '',
				slotMinutes: Agenda.def.slotduration,
				snapMinutes: 5,
				defaultEventMinutes: Agenda.def.appdurationminutes,
				firstHour: Agenda.def.starthour,
				firstDay: 1,
				minTime: Agenda.def.starthour,
				maxTime: Agenda.def.endhour,
				axisFormat: 'HH:mm',
				timeFormat: 'HH:mm',
				hiddenDays: Agenda.def.hiddendays,
				columnFormat: {
				    month: 'ddd',
				    week: 'ddd d/MMM',
				    day: 'dddd d/MMM'
				}
			}
	    };
	    $scope.eventSources = [$scope.eventsF];
	// }
    
    cleanAppointObj();
	
	Navbar.setTabSelected('agenda');
	
	// in case of routing for opening a specific appoint
	if ($routeParams.appointid) {
		$scope.loadAppointById($routeParams.appointid);
	}
	
	/*
     * WATCHES
     */
	// watch for changes in the top calendar for loading a new day
	$scope.$watch('selectedDate', function() {
		if ($scope.idoctCal) {
			$scope.idoctCal.fullCalendar('gotoDate', $scope.selectedDate);
		}
	});
	
	// change the appoint duration if the appoint type has a time duration
	$scope.$watch('agenda.obj.apptype', function(newval, oldval) {
		if (newval) {
			var found = _.find($scope.apptypescomp, function(obj){ 
				return obj.code == newval;
			});
			if (found && found.time) {
				Agenda.obj.duration = found.time;
			}
		}
	});    
		
};