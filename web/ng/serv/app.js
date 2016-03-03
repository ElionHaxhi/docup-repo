var App = angular.module('App',
 [
 	'ngRoute', 
 	'ngCookies',
 	'ngSanitize', 
 	'pascalprecht.translate',
 	'frapontillo.bootstrap-switch',
 	'ui.bootstrap',
	'appConfig',
	'appUser', 
	'appNavbar', 
	'appGendialog', 
	'appFlexform', 
	'appFlexschema', 
	'appFlexmodel', 
	'appPatient',
	'appLogin', 
	'appUI', 
	'appAnnotation', 
	'appAttach', 
	'appDocsign',
	'appService', 
	'appAgenda', 
	'appExam', 
	'appMeasure', 
	'ui.calendar', 
	'angularFileUpload', 
	'timepickerPop', 
	'angulartics', 
	'angulartics.google.analytics', 
	'google-maps'
	]);

App.factory('App', ['$window', '$cookieStore','Config', function($window, $cookieStore ,Config) {
	var app = {
		version: '3.0.1',
		params: {
			formats: {
				// date format
				dateFormat: 'dd/mm/yyyy',
				dateFormatMomentjs: 'DD/MM/YYYY',
                dateFormatMomentjsElion: 'YYYY-MM-DD',
				dateFormatFlexformOut: 'YYYY-MM-DD',
				dateFormatFlexschemaOut: 'DD/MM/YYYY',
				// datetime format
				datetimeFormat: 'dd/mm/yyyy hh:ii',
				datetimeFormatMomentjs: 'DD/MM/YYYY HH:mm',
				datetimeFormatFlexformOut: 'YYYY-MM-DD HH:mm:ss',
				datetimeFormatFlexschemaOut: 'DD/MM/YYYY HH:mm',
				// time format
				timeFormat: 'HH:mm',
				timeFormatMomentjs: 'HH:mm',
				timeFormatFlexformOut: 'HH:mm',
				// currency format
				currencyout: '$ 0.00',
				currencyparams: {
					delimiters: {
						thousands: '',
						decimal: ','
					},
					abbreviations: {
						thousand: 'mila',
						million: 'mil',
						billion: 'b',
						trillion: 't'
					},
					ordinal: function (number) {
						return 'º';
					},
					currency: {
						symbol: '€'
					}
				},
				integerout: '0',
				floatout: '0.00'
			}
		},
		news: []
	};
	
	/**
	 * Check user session
	 * 
	 */
	app.setupConfigParamas = function() {
		numeral.language('webapp', app.params.formats.currencyparams);
	    numeral.language('webapp');
	};

	app.getOldCookies = function()
	{
		return $cookieStore;
	}

    app.transformDate = function(theDate) {
        var wellFormedDate = moment(theDate).format('YYYY-MM-DD');
        return wellFormedDate;
    }

    app.transformDateTime = function(theDate) {
        var wellFormedDate = moment(theDate).format('YYYY-MM-DD HH:MM:SS');
        return wellFormedDate;
    }

	

	/**
	 * Check user session
	 * 
	 */
	app.checkUserSession = function(xhrdata) {
		if (xhrdata) {
			if (!xhrdata.ack && xhrdata.message === 'sessionout') {
				$window.location.href = Config.base_url + 'user/login';
			} else {
				return true;
			}
		}
		return true;
	};

	return app;
}]);

/*
 * ROUTING
 */

App.config(function($routeProvider) {
	$routeProvider.
	when('/login/', {
        controller: 'loginController',
        templateUrl: 'login.html'
    }).
    when('/',{
    	controller: patientsListCtrl,
        templateUrl: 'patientslist.html'
    }).
    when('/logout/', {
        controller: 'logoutController'
        //templateUrl: '/pvrepo/pvrepo.html'
    }).
	when('/patients/', {
        controller: patientsListCtrl,
        templateUrl: 'patientslist.html'
	}).
	when('/patients/refresh/', {
        controller: patientsListCtrl,
        templateUrl: 'patientslist.html'
	}).
	when('/patientdetail/', {
        controller: patientDetailsCtrl,
        templateUrl: 'patientdetails.html'
	}).
	when('/patientdetail/:id', {
        controller: patientDetailsCtrl,
        templateUrl: 'patientdetails.html'
	}).
	when('/patientcreate/', {
        controller: patientDetailsCtrl,
        templateUrl: 'patientdetails.html'
	}).
    when('/examdetail/', {
        controller: examDetailsCtrl,
        templateUrl: 'examdetails.html'
    }).
    when('/examcreate/', {
         controller: examDetailsCtrl,
         templateUrl: 'examdetails.html'
    }).
    when('/examcreate/:patientid', {
         controller: examDetailsCtrl,
         templateUrl: 'examdetails.html'
    }).
    when('/examdetail/:id', {
        controller: examDetailsCtrl,
        templateUrl: 'examdetails.html'
    }).
	when('/examslist/', {
        controller: examsListCtrl,
        templateUrl: 'examslist.html'
	}).
	when('/examslist/refresh/', {
        controller: examsListCtrl,
        templateUrl: 'examslist.html'
	});
	
})
.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login/' && !$rootScope.globals.currentUser) {
                $location.path('/login/');
            }
        });
}]);


App.config(['$translateProvider', function ($translateProvider) {
	$translateProvider.useStaticFilesLoader({
	    prefix: 'ng/i18n/locale-',
	    suffix: '.json'
	});
	$translateProvider.preferredLanguage('it');
   // $translateProvider.preferredLanguage('al');

}]);

/*
 * FILTERS
 */
App.filter('changeNewLine', function() {
	return function(input) {
		if (input && _.isString(input)) {
			return input.replace(new RegExp('\n','g'), '<br />');
		} else {
			return null;
		}
	};
});

App.filter('cutString', function () {
    return function (input, dim) {
        if (input && _.isString(input)) {
        	if (input.length > dim) {
        		return input.substr(0,dim) + "...";
        	} else {
        		return input;
        	}
        } else {
        	return null;
        }
    };
});

App.filter('stringToCurrency', ['App', function(App){
    return function (input) {
        if (input && (_.isString(input) || _.isNumber(input))) {
        	var string = numeral(parseFloat(input)).format(App.params.formats.currencyout);
        	return string;
        } else {
        	return null;
        }
    };
}]);

App.filter('stringToFloat', ['App', function(App){
	return function (input) {
		if(!_.isNull(input) && !_.isUndefined(input) && !_.isNaN(_.str.toNumber(input, 8))){
			return numeral(parseFloat(input)).format(App.params.formats.floatout);
		} else {
			return null;
		}
	};
}]);

/**
 * Filter to show a date from sql format to web format
 * 
 * @param mixed input date object or date string
 */
App.filter('dateFromSqlToHtml', function() {
	return function(input, dateformatmom) {
		if (input) {
			if (_.isDate(input)) {
				var date_moment = moment.utc(input);
			} else {
				var date_moment = moment.utc(input, 'YYYY-MM-DD');
			}
			return date_moment.format(dateformatmom);
		} else {
			return null;
		}
	};
});

/**
 *  //moment(1423237003000).zone('+0100').format('YYYY-MM-DD HH:mm:ss')
 *   questo metodo mi permette di convertire un timestamp in formato YYYY-MM-DD HH:mm:ss
 */
App.filter('dateElionFromSqlToHtml', function() {
    return function(input,dateformatmom) {
        var wellFormedDate = moment(input).zone('+0100').format('YYYY-MM-DD HH:MM:SS');

        if (wellFormedDate) {
            //var retvaldate;
            if (_.isDate(input)) {
//                var date_moment = moment(input).zone('+0100').format('YYYY-MM-DD');

                var date_moment = moment.utc(input);
            } else {
                var date_moment = moment(input).zone('+0100').format(dateformatmom);
              //  retvaldate = new Date(date_moment);
                // qui li aggiungo un + uno perche il mese appare sempre con -1
                //retvaldate.setUTCDate(retvaldate.getUTCDate()+1);
                //retvaldate.setM(retvaldate.)
            }
            return date_moment;
        } else {
            return null;
        }
    };
});




/**
 * Filter to show a datetime from sql format to web format
 * 
 * @param mixed input date object or date string
 */
App.filter('dateTimeFromSqlToHtml', function() {
	return function(input, datetimeformatmom) {
		if (input) {
			if (_.isDate(input)) {
				var date_moment = moment.utc(input);
			} else {
				var date_moment = moment.utc(input, 'YYYY-MM-DD HH:mm:ss');
			}
			return date_moment.format(datetimeformatmom);
		} else {
			return null;
		}
	};
});

/**
 *  //moment(1423237003000).zone('+0100').format('YYYY-MM-DD HH:mm:ss')
 *  questo metodo mi permette di convertire un timestamp in formato YYYY-MM-DD HH:mm:ss
 */
App.filter('dateTimeElionFromSqlToHtml', function() {
    return function(input, datetimeformatmom) {
        if (input) {
            if (_.isDate(input)) {
                var date_moment = moment.utc(input);
            } else {
                var date_moment = moment(input).zone('+0100').format('YYYY-MM-DD HH:mm:ss');
            }
            return date_moment.format(datetimeformatmom);
        } else {
            return null;
        }
    };
});


/**
 * Filter to show a time from sql datetime format to web format
 *
 * @param mixed input date object or date string
 */
App.filter('timeElionFromSqlDatetimeToHtml', function() {
    return function(input, timeformat) {
        if (input) {
            if (_.isDate(input)) {
                var date_moment = moment.utc(input);
            } else {
                var date_moment = moment(input).zone('+0100').format('HH:mm:ss');
            }
            return date_moment.format(timeformat);
        } else {
            return null;
        }
    };
});




/**
 * Filter to show a time from sql datetime format to web format
 * 
 * @param mixed input date object or date string
 */
App.filter('timeFromSqlDatetimeToHtml', function() {
	return function(input, timeformat) {
		if (input) {
			if (_.isDate(input)) {
				var date_moment = moment.utc(input);
			} else {
				var date_moment = moment.utc(input, 'HH:mm:ss');
			}
			return date_moment.format(timeformat);
		} else {
			return null;
		}
	};
});

/*
 * DIRECTIVES
 */
App.directive('flotchart', function(){
	return{
        restrict: 'E',
        template: '<div></div>',
    	replace: true,
    	scope: {
			ngModel: '=',
			graphOpts: '=',
			graphHeight: '@'
	    },
	    link: function(scope, elem, attrs){
			var chart = null;
            
            var opts  = scope.graphOpts;
            elem.height( scope.graphHeight );
            
            elem.bind('plothover', function (event, pos, item) {
            	//console.log(item);
            });
            
            scope.$watch('ngModel', function(val){
                if(!chart) {
					//console.log("!chart");
					//console.log(val);
                	if (val && val[0] && val[0].data && !_.isEmpty(val[0].data)) {
                		//console.log("graph loaded: %o", val);
                    	chart = $.plot(elem, val, opts);
                    	elem.show();
                	}
                }else{
					//console.log("chart");
					//console.log(val);
                    chart.setData(val);
                    chart.setupGrid();
                    chart.draw();
                }
            });
        }
    };
});

App.directive('visTimeline', function(){
 	return {
		restrict: 'AE',
		scope: {
		  data: '=data',
		  options: '=options',
		  event: '@event',
		  callback: '&'
		},
		link: function(scope, element, attrs) {        
			var container = element[0];
			var graph = new vis.Timeline(container, [], scope.options);
			// add event callback to the timetable
			graph.on(scope.event, function(properties) {
				if (properties.nodes.length !== 0) { 
					scope.callback({params: properties});
				} 
			});
			// refresh timetable items
			var buildGraph = function(scope) {
				graph.setItems(scope.data);
			};
			// watch for changes to update the timeline
			scope.$watch('data', function(newval, oldval) {
				if (scope.data) {
					var options = {};
					options.min = moment('1950-01-01', 'YYYY-MM-DD').toDate();
					options.max = moment('2050-01-01', 'YYYY-MM-DD').toDate();
					options.end = moment().add('days', 7).toDate();
					var lastexam = _.last(scope.data);
					if (lastexam) {
						options.start = moment(lastexam.start, 'YYYY-MM-DD').subtract('days', 7).toDate();
					}
					graph.setOptions(options);
				}
				buildGraph(scope);
			}, true);        
		}
	};
});

App.directive('confirmDialog', function(){
	return{
        restrict: 'ECMA',
        template: '<div></div>',
    	replace: true,
    	scope: {
			ngModel: '=',
			graphOpts: '=',
			graphHeight: '@'
	    },
	    link: function(scope, elem, attrs){
			var chart = null;
            
            var opts  = scope.graphOpts;
            elem.height( scope.graphHeight );
            
            elem.bind('plothover', function (event, pos, item) {
            	//console.log(item);
            });
            
            scope.$watch('ngModel', function(val){
                if(!chart) {
                	if (val && val[0] && val[0].data && !_.isEmpty(val[0].data)) {
                		//console.log("graph loaded: %o", val);
                    	chart = $.plot(elem, val, opts);
                    	elem.show();
                	}
                }else{
                    chart.setData(val);
                    chart.setupGrid();
                    chart.draw();
                }
            });
        }
    };
});