var appFlexform = angular.module('appFlexform', []);

appFlexform.factory('Flexform', function() {
	return { };
});

/**********************************************************************************************************************/
/** FILTERS **/
/**********************************************************************************************************************/

/**
 * Filter to show on web a flexform field on the base of its type
 *
 * @param object input flexform field
 * @param string flextype type of the flexform field (textarea, date, datetime, list, switch)
 * @param string dateformatmom date format for momentjs
 * @param string datetimeformatmom datetime format for momentjs
 */
appFlexform.filter('flexformFieldView', function() {
	return function(input, flextype, flexvarobj) {
		if (flextype) {
			var newinput = null;
			switch(flextype) {
				case 'textarea':
					if (!_.str.isBlank(input)) {
						newinput = input.replace(new RegExp('\n','g'), '<br />');
					}
					break;
				case 'date':
				case 'datetime':
					if (!_.str.isBlank(input) && flexvarobj) {
						var newdate = moment(input, flexvarobj.datetimeformatout, true);
						if (newdate.isValid()) {
							newinput =  newdate.format(flexvarobj.datetimeformatmom);
						}
					}
					break;
				case 'dropdown':
					if (!_.str.isBlank(input)) {
						var listtext = _.find(flexvarobj.list, function(data) {
							return data.value == input;
						});
						if (listtext && listtext.text) {
							newinput = listtext.text.toString();
						}
					}
					break;
				case 'switch':
					newinput = (input == true) ? '<span class="glyphicon glyphicon-ok"></span>' : '<span class="glyphicon glyphicon-remove"></span>';
					break;
				default:
					newinput = input;
			}
			if (!newinput) {
				newinput = null;
			}
			if (!_.str.isBlank(newinput) && flexvarobj && flexvarobj.format) {
				newinput = _.str.sprintf(flexvarobj.format, eval(newinput));
			}
			if (!_.str.isBlank(newinput) && flexvarobj && flexvarobj.pretext) {
				newinput = flexvarobj.pretext + ' ' + newinput;
			}
			if (!_.str.isBlank(newinput) && flexvarobj && flexvarobj.posttext) {
				newinput = newinput + ' ' + flexvarobj.posttext;
			}

			return newinput;
		} else {
			return input;
		}
	};
});


/**********************************************************************************************************************/
/** DIRECTIVES **/
/**********************************************************************************************************************/

/**
 * Directive to generate a string field in a flexform
 *
 */
appFlexform.directive('flexformFieldString', ['$translate', function($translate){
	return {
		restrict: 'ECMA',
		replace: true,
		require: 'ngModel',
		template:
			'<div>' +
				'<div class="form-group">' +
				'<label ng-show="flexlabel">' +
				'<span class="flexlabeltext">{{flexviztype.pretext}}{{flexlabel}}{{flextype.flexviztype}}</span>' +
				'<a ng-show="flexdescr"> <span tooltip-placement="bottom" tooltip="{{flexdescr}}" class="flexinfotip"><span class="glyphicon glyphicon-info-sign" style="color: #aaaaaa;"></span></span></a> '+
				'<a ng-hide="flexvalid"> <span tooltip-placement="right" tooltip="{{flexerr}}" class="flexerrtip"><span class="glyphicon glyphicon-warning-sign" style="color: #A94442;"></span></span></a>'+
				'</label>' +
				'<input ng-show="flexformenabled" type="text" ng-class="{classflexinvalid: !flexvalid}" ng-model="flexmodel" ng-disabled="flexdisabled" name="{{name}}" class="form-control classflexfield" placeholder="{{placeholder}}" />' +
				'<div ng-hide="flexformenabled" class="classflextext">{{flexmodel | flexformFieldView:\'string\':flexviztype}}</div>' +
				'</div>' +
				'</div>',
		scope: {
			flexmodel: '=ngModel',
			flexrequired: '=ngRequired',
			name: '@',
			placeholder: '@',
			flexlabel: '=',
			flexdescr: '=',
			flexdisabled: '=ngDisabled',
			flextype: '=',
			flexformenabled: '='
		},
		link: function(scope, element, attrs, ngModel) {

			scope.flexerr = $translate('GENERAL.FORM.FORMFIELDMANDATORY');

			scope.$watch(function(){return ngModel.$valid;}, function(newval) {
				scope.flexvalid = newval;
			});

			// prepare the flextype object if not present
			scope.flexviztype = angular.copy(scope.flextype);
			if (!scope.flexviztype) {
				scope.flexviztype = {};
			}

			if(scope.flexviztype.pretext)  scope.flexviztype.pretext  = "(" + scope.flexviztype.pretext + ") ";
			if(scope.flexviztype.posttext) scope.flexviztype.posttext = " (" + scope.flexviztype.posttext + ")";
			if(scope.flexviztype.initval) scope.flexmodel = scope.flexviztype.initval;

		}
	};
}]);

/**
 * Directive to generate a typehead field in a flexform
 *
 */
appFlexform.directive('flexformFieldTypehead', ['$translate', function($translate){
	return {
		restrict: 'ECMA',
		replace: true,
		require: 'ngModel',
		template:
			'<div>' +
				'<div class="form-group">' +
				'<label ng-show="flexlabel">' +
				'<span class="flexlabeltext">{{flexviztype.pretext}}{{flexlabel}}{{flexviztype.posttext}}</span>' +
				'<a ng-show="flexdescr"><span tooltip-placement="bottom" tooltip="{{flexdescr}}" class="flexinfotip"><span class="glyphicon glyphicon-info-sign" style="color: #aaaaaa;"></span></span></a> ' +
				'<a ng-hide="flexvalid"><span tooltip-placement="right" tooltip="{{flexerr}}" class="flexerrtip"><span class="glyphicon glyphicon-warning-sign" style="color: #A94442;"></span></span></a>' +
				'</label>' +
				'<div ng-show="flexformenabled" class="input-group">' +
				'<input type="text" ng-class="{classflexinvalid: !flexvalid}" ng-model="flexmodel" name="{{name}}" class="form-control classflexfield" typeahead="x as x[flextypeaheadName] for x in flextypeaheadList | filter:$viewValue | limitTo:flextypeaheadLimit" typeahead-min-length="{{flextypeaheadMinLength}}" placeholder="{{placeholder}}" autocomplete="off" />' +
				'<span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>' +
				'</div>' +
				'<div ng-hide="flexformenabled" class="classflextext">{{flexmodel | flexformFieldView:\'string\':flexviztype}}</div>' +
				'</div>' +
				'</div>',
		scope: {
			flexmodel: '=ngModel',
			flexrequired: '=ngRequired',
			name: '@',
			placeholder: '@',
			flexlabel: '=',
			flexdescr: '=',
			flextype: '=',
			flexformenabled: '=',
			flextypeaheadList: '=flexTypeaheadList',				// list of elements to search in
			flextypeaheadInit: '@flexTypeaheadInit',				// initial value
			flextypeaheadName: '=flexTypeaheadName',				// name of the property to get use as field content
			flextypeaheadLimit: '=flexTypeaheadLimit',				// max number of elements shown in the list
			flextypeaheadMinLength: '@flexTypeaheadMinLength',		// min length of the inserted element to start the search
			flextypeaheadOnSelect: '&flexTypeaheadOnSelect', 		// external controller function to call on select
			flextypeaheadOnDeselect: '&flexTypeaheadOnDeselect',	// external controller function to call on deselect
			flextypeaheadRefElement: '=flexTypeaheadRefElement'
		},
		link: function(scope, element, attrs, ngModel) {

			var elems = element.children();
			var inputelem = elems.find('input');
			var butdel = elems.find('.glyphicon-remove');
			butdel.hide();
			var flagsel = false;

			scope.$watch('flexmodel', function(item) {
				if (scope.flextypeaheadInit) {
					var inititem = _.findWhere(scope.flextypeaheadList, {id: scope.flextypeaheadInit});
					if (inititem) {
						scope.flextypeaheadOnSelect({t: inititem, ref: scope.flextypeaheadRefElement});
						inputelem.prop('disabled', true);
						butdel.show();
						scope.flexmodel = inititem[scope.flextypeaheadName];
						flagsel = true;
					}
				} else {
					inputelem.prop('disabled', false);
					butdel.hide();
					flagsel = false;
				}

				// only when an element is selected the flexmodel is an object
				if (_.isObject(item)) {
					scope.flextypeaheadOnSelect({t: item, ref: scope.flextypeaheadRefElement});
					inputelem.prop('disabled', true);
					butdel.show();
					scope.flexmodel = item[scope.flextypeaheadName];
					flagsel = true;
				} else {
					if (!flagsel) {
						inputelem.prop('disabled', false);
						butdel.hide();
					}
				}
			});

			butdel.bind('click', function() {
				var inputelem = elems.find('input');
				inputelem.prop('disabled', false);
				butdel.hide();
				flagsel = false;
				if (scope.flextypeaheadOnDeselect) {
					scope.flextypeaheadOnDeselect({ref: scope.flextypeaheadRefElement});
				}
			});

			scope.flexerr = $translate('GENERAL.FORM.FORMFIELDMANDATORY');

			scope.$watch(function(){return ngModel.$valid;}, function(newval) {
				scope.flexvalid = newval;
			});

			// prepare the flextype object if not present
			// prepare the flextype object if not present
			scope.flexviztype = angular.copy(scope.flextype);
			if (!scope.flexviztype) {
				scope.flexviztype = {};
			}

			if(scope.flexviztype.pretext)  scope.flexviztype.pretext  = "(" + scope.flexviztype.pretext + ") ";
			if(scope.flexviztype.posttext) scope.flexviztype.posttext = " (" + scope.flexviztype.posttext + ")";
			if(scope.flexviztype.initval) scope.flexmodel = scope.flexviztype.initval;
		}
	};
}]);

/**
 * Directive to generate a numeral field in a flexform
 *
 */
appFlexform.directive('flexformFieldNumeral', ['$translate', function(){
	return {
		restrict: 'ECMA',
		replace: true,
		require: 'ngModel',
		template:
			'<div>' +
				'<div class="form-group">' +
				'<label ng-show="flexlabel">' +
				'<span class="flexlabeltext">{{flexviztype.pretext}}{{flexlabel}}{{flexviztype.posttext}}</span>' +
				'<a ng-show="flexdescr"> <span tooltip-placement="bottom" tooltip="{{flexdescr}}" class="flexinfotip"><span class="glyphicon glyphicon-info-sign" style="color: #aaaaaa;"></span></span></a> '+
				'<a ng-hide="flexvalid"> <span tooltip-placement="right" tooltip="{{flexerr}}" class="flexerrtip"><span class="glyphicon glyphicon-warning-sign" style="color: #A94442;"></span></span></a>'+
				'</label>' +
				'<input type="text" ng-show="flexformenabled" name="{{name}}" ng-class="{classflexinvalid: !flexvalid}" class="form-control classflexfield" placeholder="{{placeholder}}" />' +
				'<div ng-hide="flexformenabled" class="classflextext"></div>' +
				'</div>' +
				'</div>',
		scope: {
			flexmodel: '=ngModel',
			flexrequired: '=ngRequired',
			name: '@',
			placeholder: '@',
			flexlabel: '=',
			flexdescr: '=',
			flextype: '=',
			flexformenabled: '=',
			flexdecimalsep: '@',
			flexthousandsep: '@'
		},
		link: function(scope, element, attrs, ngModel) {

			scope.$watch(function(){return ngModel.$valid;}, function(newval) {
				scope.flexvalid = newval;
			});

			// prepare the autonumeric config
			var config = {
				aSep: scope.flexthousandsep,
				aDec: scope.flexdecimalsep,
				aPad: false,
				vMin: '-99999999999999999999.9999999',
				vMax: '99999999999999999999.9999999'
			};
			// prepare the input field
			var input = element.find('input');
			input.autoNumeric('init', config);
			input.bind('blur keyup', function() {
				scope.$apply(function () {
					scope.flexmodel = input.autoNumeric('get');
				});
			});

			// prepare the flextype object if not present
			scope.flexviztype = angular.copy(scope.flextype);
			if (!scope.flexviztype) {
				scope.flexviztype = {};
			}

			if(scope.flexviztype.pretext)  scope.flexviztype.pretext  = "(" + scope.flexviztype.pretext + ") ";
			if(scope.flexviztype.posttext) scope.flexviztype.posttext = " (" + scope.flexviztype.posttext + ")";
			if(scope.flexviztype.initval) scope.flexmodel = scope.flexviztype.initval;

			// prepare the output field
			var output = element.find('.classflextext');
			output.autoNumeric('init', config);

			scope.$watch('flexmodel', function(newval) {
				if (newval && !_.isNaN(newval)) {
					input.autoNumeric('set', newval);
					output.autoNumeric('set', newval);
				} else {
					input.val(null);
					output.html(null);
				}
			});
		}
	};
}]);

/**
 * Directive to generate a currency field in a flexform
 *
 */
appFlexform.directive('flexformFieldCurrency', ['$translate', function(){
	return {
		restrict: 'ECMA',
		replace: true,
		require: 'ngModel',
		template:
			'<div>' +
				'<div class="form-group">' +
				'<label ng-show="flexlabel">' +
				'<span class="flexlabeltext">{{flexviztype.pretext}}{{flexlabel}}{{flexviztype.posttext}}</span>' +
				'<a ng-show="flexdescr"> <span tooltip-placement="bottom" tooltip="{{flexdescr}}" class="flexinfotip"><span class="glyphicon glyphicon-info-sign" style="color: #aaaaaa;"></span></span></a> '+
				'<a ng-hide="flexvalid"> <span tooltip-placement="right" tooltip="{{flexerr}}" class="flexerrtip"><span class="glyphicon glyphicon-warning-sign" style="color: #A94442;"></span></span></a>'+
				'</label>' +
				'<input type="text" ng-show="flexformenabled" name="{{name}}" ng-class="{classflexinvalid: !flexvalid}" class="form-control classflexfield" placeholder="{{placeholder}}" />' +
				'<div ng-hide="flexformenabled" class="classflextext"></div>' +
				'</div>' +
				'</div>',
		scope: {
			flexmodel: '=ngModel',
			flexrequired: '=ngRequired',
			name: '@',
			placeholder: '@',
			flexlabel: '=',
			flexdescr: '=',
			flextype: '=',
			flexformenabled: '=',
			flexdecimalsep: '@',
			flexthousandsep: '@',
			flexcurrencycode: '@',
			flexdecimalsize: '@'
		},
		link: function(scope, element, attrs, ngModel) {

			scope.$watch(function(){return ngModel.$valid;}, function(newval) {
				scope.flexvalid = newval;
			});

			// prepare the autonumeric config input
			var configInput = {
				aSep: scope.flexthousandsep,
				aDec: scope.flexdecimalsep,
				aSign: scope.flexcurrencycode + ' ',
				pSign: 'p',
				mDec: scope.flexdecimalsize,
				aPad: false,
				vMin: '-99999999999999999999.99',
				vMax: '99999999999999999999.99'
			};
			// prepare the input field
			var input = element.find('input');
			input.autoNumeric('init', configInput);
			input.bind('blur keyup', function() {
				scope.$apply(function () {
					scope.flexmodel = input.autoNumeric('get');
				});
			});

			// prepare the autonumeric config output
			var configOutput = {
				aSep: scope.flexthousandsep,
				aDec: scope.flexdecimalsep,
				aSign: scope.flexcurrencycode + ' ',
				pSign: 'p',
				mDec: scope.flexdecimalsize,
				aPad: true,
				vMin: '-99999999999999999999.99',
				vMax: '99999999999999999999.99'
			};

			// prepare the flextype object if not present
			scope.flexviztype = angular.copy(scope.flextype);
			if (!scope.flexviztype) {
				scope.flexviztype = {};
			}

			if(scope.flexviztype.pretext)  scope.flexviztype.pretext  = "(" + scope.flexviztype.pretext + ") ";
			if(scope.flexviztype.posttext) scope.flexviztype.posttext = " (" + scope.flexviztype.posttext + ")";
			if(scope.flexviztype.initval) scope.flexmodel = scope.flexviztype.initval;

			// prepare the output field
			var output = element.find('.classflextext');
			output.autoNumeric('init', configOutput);

			scope.$watch('flexmodel', function(newval) {
				if (newval && !_.isNaN(newval)) {
					input.autoNumeric('set', newval);
					output.autoNumeric('set', newval);
				} else {
					input.val(null);
					output.html(null);
				}
			});
		}
	};
}]);

/**
 * Directive to generate a textarea field in a flexform
 *
 */
appFlexform.directive('flexformFieldTextarea', ['$translate', function($translate){
	return {
		restrict: 'ECMA',
		replace: true,
		require: 'ngModel',
		template:
			'<div>' +
				'<div class="form-group">' +
				'<label ng-show="flexlabel">' +
				'<span class="flexlabeltext">{{flexviztype.pretext}}{{flexlabel}}{{flexviztype.posttext}}</span>' +
				'<a ng-show="flexdescr"> <span tooltip-placement="bottom" tooltip="{{flexdescr}}" class="flexinfotip"><span class="glyphicon glyphicon-info-sign" style="color: #aaaaaa;"></span></span></a> '+
				'<a ng-hide="flexvalid"> <span tooltip-placement="right" tooltip="{{flexerr}}" class="flexerrtip"><span class="glyphicon glyphicon-warning-sign" style="color: #A94442;"></span></span></a>'+
				'</label>' +
				'<textarea ng-model="flexmodel" ng-show="flexformenabled" name="{{name}}" ng-class="{classflexinvalid: !flexvalid}" class="form-control classflexfield" rows="5" placeholder="{{placeholder}}"></textarea>' +
				'<div ng-hide="flexformenabled" class="classflextext" ng-bind-html="flexmodel | flexformFieldView:\'textarea\':flexviztype"></div>' +
				'</div>' +
				'</div>',
		scope: {
			flexmodel: '=ngModel',
			flexrequired: '=ngRequired',
			name: '@',
			placeholder: '@',
			flexlabel: '=',
			flexdescr: '=',
			flextype: '=',
			flexformenabled: '='
		},
		link: function(scope, element, attrs, ngModel) {

			scope.flexerr = $translate('GENERAL.FORM.FORMFIELDMANDATORY');

			scope.$watch(function(){return ngModel.$valid;}, function(newval) {
				scope.flexvalid = newval;
			});

			// prepare the flextype object if not present
			scope.flexviztype = angular.copy(scope.flextype);
			if (!scope.flexviztype) {
				scope.flexviztype = {};
			}

			if(scope.flexviztype.pretext)  scope.flexviztype.pretext  = "(" + scope.flexviztype.pretext + ") ";
			if(scope.flexviztype.posttext) scope.flexviztype.posttext = " (" + scope.flexviztype.posttext + ")";
			if(scope.flexviztype.initval) scope.flexmodel = scope.flexviztype.initval;
		}
	};
}]);

/**
 * Directive to generate a range field in a flexform
 *
 */
appFlexform.directive('flexformFieldRange', ['$translate', function(){
	return {
		restrict: 'ECMA',
		replace: true,
		require: 'ngModel',
		template:
			'<div>' +
				'<div class="form-group">' +
				'<label ng-show="flexlabel">' +
				'<span class="flexlabeltext">{{flexviztype.pretext}}{{flexlabel}}{{flexviztype.posttext}}</span>' +
				'<a ng-show="flexdescr"> <span tooltip-placement="bottom" tooltip="{{flexdescr}}" class="flexinfotip"><span class="glyphicon glyphicon-info-sign" style="color: #aaaaaa;"></span></span></a> '+
				'<a ng-hide="flexvalid"> <span tooltip-placement="right" tooltip="{{flexerr}}" class="flexerrtip"><span class="glyphicon glyphicon-warning-sign" style="color: #A94442;"></span></span></a>'+
				'</label>' +
				'<div ng-show="flexformenabled" class="row" style="position: relative;">' +
				'<div style="width: 100px; float: left; padding-top: 4px;">' +
				'<input type="text" name="{{name}}" ng-class="{classflexinvalid: !flexvalid}" class="form-control classflexfield" style="width: 80px;" placeholder="{{placeholder}}">' +
				'</div>' +
				'<div style="width: 80px; float: left; padding-top: 4px;">' +
				'<button class="btn btn-default rangeless" type="button">' +
				'<span class="glyphicon glyphicon-step-backward"></span>' +
				'</button>' +
				'<button class="btn btn-default rangeplus" type="button">' +
				'<span class="glyphicon glyphicon-step-forward"></span>' +
				'</button>' +
				'</div>' +
				'<div style="position: absolute; left: 200px; right: 10px; padding-top: 0; float: left;">' +
				'<div class="noUiSlider"></div>' +
				'</div>' +
				'</div>' +
				'<div ng-hide="flexformenabled" class="classflextext">{{flexmodel | flexformFieldView:\'range\':flexviztype}}</div>' +
				'</div>' +
				'</div>',
		scope: {
			flexmodel: '=ngModel',
			flexrequired: '=ngRequired',
			name: '@',
			placeholder: '@',
			flexlabel: '=',
			flexdescr: '=',
			flextype: '=',
			flexformenabled: '=',
			flexdecimalsep: '@',
			flexthousandsep: '@'
		},
		link: function(scope, element, attrs, ngModel) {

			scope.$watch(function(){return ngModel.$valid;}, function(newval) {
				scope.flexvalid = newval;
			});

			var updateModel = function(data) {
				scope.$apply(function () {
					scope.flexmodel = data;
				});
			};

			// prepare the field
			var butless = element.find('.rangeless');
			var butplus = element.find('.rangeplus');
			var slider = element.find('.noUiSlider');
			scope.flexviztype = angular.copy(scope.flextype);
			if (!scope.flexviztype) {
				scope.flexviztype = {};
			}

			if(scope.flexviztype.pretext)  scope.flexviztype.pretext  = "(" + scope.flexviztype.pretext + ") ";
			if(scope.flexviztype.posttext) scope.flexviztype.posttext = " (" + scope.flexviztype.posttext + ")";
			if(scope.flexviztype.initval) scope.flexmodel = scope.flexviztype.initval;

			// setup slider
			slider.noUiSlider({
				range: [scope.flexviztype.minval, scope.flexviztype.maxval],
				handles: 1,
				start: scope.flexviztype.minval,
				step: scope.flexviztype.step,
				slide: function() {
					var newvalue = $(this).val();
					updateModel(newvalue);
				},
				set: function() {
					var newvalue = $(this).val();
					updateModel(newvalue);
				}
			});
			// setup buttons
			butless.bind('click', function(){
				var newvalue = angular.copy(scope.flexmodel);
				if (newvalue) {
					newvalue = parseFloat(newvalue) - parseFloat(scope.flexviztype.step);
				} else {
					newvalue = parseFloat(scope.flexviztype.step);
				}
				if (newvalue < parseFloat(scope.flexviztype.minval)) {
					newvalue = parseFloat(scope.flexviztype.minval);
				}
				updateModel(newvalue.toString());
			});
			butplus.bind('click', function(){
				var newvalue = angular.copy(scope.flexmodel);
				if (newvalue) {
					newvalue = parseFloat(newvalue) + parseFloat(scope.flexviztype.step);
				} else {
					newvalue = parseFloat(scope.flexviztype.minval) + parseFloat(scope.flexviztype.step);
				}
				if (newvalue > parseFloat(scope.flexviztype.maxval)) {
					newvalue = parseFloat(scope.flexviztype.maxval);
				}
				updateModel(newvalue.toString());
			});

			// prepare the autonumeric config
			var config = {
				aSep: scope.flexthousandsep,
				aDec: scope.flexdecimalsep,
				aPad: false,
				vMin: '-99999999999999999999.9999999',
				vMax: '99999999999999999999.9999999'
			};
			// prepare the input field
			var input = element.find('input');
			input.autoNumeric('init', config);
			input.bind('blur keyup', function() {
				scope.$apply(function () {
					scope.flexmodel = input.autoNumeric('get');
				});
			});
			// prepare the output field
			var output = element.find('.classflextext');
			output.autoNumeric('init', config);

			scope.$watch('flexmodel', function(newval) {
				if (newval && !_.isNaN(newval)) {
					input.autoNumeric('set', newval);
					output.autoNumeric('set', newval);
					slider.val(newval);
				} else {
					input.val(null);
					output.html(null);
				}
			});

		}
	};
}]);

/**
 * Directive to generate a calculated field in a flexform
 *
 */
appFlexform.directive('flexformFieldCalculated', ['$translate', function(){
	return {
		restrict: 'ECMA',
		replace: true,
		require: 'ngModel',
		template:
			'<div>' +
				'<div class="form-group">' +
				'<label ng-show="flexlabel">' +
				'<span class="flexlabeltext">{{flexviztype.pretext}}{{flexlabel}}{{flexviztype.posttext}}</span>' +
				'<a ng-show="flexdescr"> <span tooltip-placement="bottom" tooltip="{{flexdescr}}" class="flexinfotip"><span class="glyphicon glyphicon-info-sign" style="color: #aaaaaa;"></span></span></a> '+
				'<a ng-hide="flexvalid"> <span tooltip-placement="right" tooltip="{{flexerr}}" class="flexerrtip"><span class="glyphicon glyphicon-warning-sign" style="color: #A94442;"></span></span></a>'+
				'</label>' +
				'<div ng-show="flexformenabled" class="input-group">' +
				'<input type="text" type=name="{{name}}" ng-class="{classflexinvalid: !flexvalid}" class="form-control classflexfield" placeholder="{{placeholder}}" readonly>' +
				'<span class="input-group-addon">' +
				'<a href="" class="calcbutt"><span class="glyphicon glyphicon-refresh"></span></a>' +
				'</span>' +
				'</div>' +
				'<div ng-hide="flexformenabled" class="classflextext">{{flexmodel | flexformFieldView:\'calculated\':flexviztype}}</div>' +
				'</div>' +
				'</div>',
		scope: {
			flexmodel: '=ngModel',
			flexrequired: '=ngRequired',
			name: '@',
			placeholder: '@',
			flexlabel: '=',
			flexdescr: '=',
			flextype: '=',
			flexformenabled: '=',
			flextypearr: '=',
			flexmodelarr: '=',
			flexdecimalsep: '@',
			flexthousandsep: '@'
		},
		link: function(scope, element, attrs, ngModel) {
			scope.$watch(function(){return ngModel.$valid;}, function(newval) {
				scope.flexvalid = newval;
			});

			var updateModel = function(data) {
				scope.$apply(function () {
					scope.flexmodel = data;
				});
			};

			// prepare field
			var butt = element.find('.calcbutt');
			//scope.flextype = scope.flextype();

			// prepare button
			butt.bind('click', function(){
				var fullString = _.clone(scope.flextype.formula);
				_.each(scope.flextypearr, function(element, index) {
					if (scope.flexmodelarr[index] || scope.flexmodelarr[index] === 0) {
						var regstr = "<!" + index + "!>";
						var regexp = new RegExp(regstr, "g");
						fullString = fullString.replace(regexp, scope.flexmodelarr[index]);
					}
				});
				try {
					var result = eval(fullString);

					if (scope.flextype.format) {
						result = _.str.sprintf(scope.flextype.format, eval(fullString));
					}

					updateModel(result);
				} catch(err) {
					updateModel(null);
				}
			});

			// prepare the autonumeric config
			var config = {
				aSep: scope.flexthousandsep,
				aDec: scope.flexdecimalsep,
				aPad: false,
				vMin: '-99999999999999999999.9999999',
				vMax: '99999999999999999999.9999999'
			};
			// prepare the input field
			var input = element.find('input');
			input.autoNumeric('init', config);
			// prepare the output field
			var output = element.find('.classflextext');
			output.autoNumeric('init', config);

			scope.$watch('flexmodel', function(newval) {
				if (newval && !_.isNaN(newval)) {
					input.autoNumeric('set', newval);
					output.autoNumeric('set', newval);
				} else {
					input.val(null);
					output.html(null);
				}
			});

			scope.flexviztype = angular.copy(scope.flextype);
			if (!scope.flexviztype) {
				scope.flexviztype = {};
			}
			if(scope.flexviztype.pretext)  scope.flexviztype.pretext  = "(" + scope.flexviztype.pretext + ") ";
			if(scope.flexviztype.posttext) scope.flexviztype.posttext = " (" + scope.flexviztype.posttext + ")";
			if(scope.flexviztype.initval) scope.flexmodel = scope.flexviztype.initval;
		}
	};
}]);

/**
 * Directive to generate a datetime field in a flexform
 *
 */
appFlexform.directive('flexformFieldDatetime', ['$translate', function($translate){
	return {
		restrict: 'ECMA',
		replace: true,
		require: 'ngModel',
		template:
			'<div>' +
				'<div class="form-group">' +
				'<label ng-show="flexlabel">' +
				'<span class="flexlabeltext">{{flexviztype.pretext}}{{flexlabel}}{{flexviztype.posttext}}</span>' +
				'<a ng-show="flexdescr"> <span tooltip-placement="bottom" tooltip="{{flexdescr}}" class="flexinfotip"><span class="glyphicon glyphicon-info-sign" style="color: #aaaaaa;"></span></span></a> '+
				'<a ng-hide="flexvalid"> <span tooltip-placement="right" tooltip="{{flexerr}}" class="flexerrtip"><span class="glyphicon glyphicon-warning-sign" style="color: #A94442;"></span></span></a>'+
				'</label>' +
				'<div ng-show="flexformenabled" class="input-group">' +
				'<input name="{{name}}" ng-class="{classflexinvalid: !flexvalid}" type="text" class="form-control classflexfield datepickerinput" placeholder="{{placeholder}}" />' +
				'<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>' +
				'</div>' +
				'<div ng-hide="flexformenabled" class="classflextext">{{flexmodel | flexformFieldView:\'datetime\':flexviztype}}</div>' +
				'</div>' +
				'</div>',
		scope: {
			flexmodel: '=ngModel',
			flexrequired: '=ngRequired',
			name: '@',
			placeholder: '@',
			flexlabel: '=',
			flexdescr: '=',
			flextype: '=',
			flexformenabled: '=',
			flexincludetime: '=',
			flexdatetimeformatviz: '@',
			flexdatetimeformatout: '@',
			flexdatetimeformatmom: '@'
		},
		link: function(scope, element, attrs, ngModel) {

			var setError = function(errflag, msg) {
				if (errflag) {
					if (msg) {
						scope.flexerr = msg;
					} else {
						scope.flexerr = $translate('GENERAL.FORM.FORMFIELDERROR');
					}
					ngModel.$setValidity('apperr', false);
				} else {
					ngModel.$setValidity('apperr', true);
				}
			};

			scope.$watch(function(){return ngModel.$valid;}, function(newval) {
				scope.flexvalid = newval;
			});

			var checkErr = function(datef) {
				if (_.str.isBlank(datef)) {
					if (scope.flexrequired) {
						setError(true, $translate('GENERAL.FORM.FORMFIELDMANDATORY'));
						return false;
					} else {
						setError(false);
						return true;
					}
				} else {
					var datemom = moment(datef, scope.flexdatetimeformatout, true);
					if (datemom.isValid() && datemom.year() > 1900) {
						setError(false);
						return true;
					} else {
						setError(true, $translate('GENERAL.FORM.FORMFIELDFORMATNOTVALID'));
						return false;
					}
				}
			};

			var updateModel = function(datef) {
				var datemom = moment(datef, scope.flexdatetimeformatmom, true);
				var datefchekck = datemom.format(scope.flexdatetimeformatout);
				var newdatefout = datef;

				if (checkErr(datefchekck) && datemom.isValid()) {
					if (datemom.year() > 1900) {
						newdatefout = datemom.format(scope.flexdatetimeformatout);
					}
				}

				if (newdatefout) {
					scope.$apply(function () {
						scope.flexmodel = newdatefout;
					});
				}
			};

			var fieldChanged = function(datejs) {
				var newval =(scope.flexincludetime) ? moment.utc(datejs) : moment(datejs);

				if (newval.isValid()) {
					updateModel(newval.format(scope.flexdatetimeformatmom));
				}
			};

			// prepare field
			var elems = element.children();
			var input = elems.find('.datepickerinput');
			var butt = input.next();
			scope.flexviztype = angular.copy(scope.flextype);
			
			if (!scope.flexviztype) {
				scope.flexviztype = {};
			}
			scope.flexviztype.datetimeformatmom = scope.flexdatetimeformatmom;
			scope.flexviztype.datetimeformatout = scope.flexdatetimeformatout;

			if(scope.flexviztype.pretext)  scope.flexviztype.pretext  = "(" + scope.flexviztype.pretext + ") ";
			if(scope.flexviztype.posttext) scope.flexviztype.posttext = " (" + scope.flexviztype.posttext + ")";
			if(scope.flexviztype.initval) scope.flexmodel = scope.flexviztype.initval;

			var flagopen = false;

			input.bind('blur keyup', function() {
				updateModel(input.val());
			});

			butt.bind('click', function() {
				if (!flagopen) {
					if (!scope.flexincludetime) {
						// case no time
						var dpick = input.datepicker({
							format: scope.flexdateformatviz,
							orientation: 'auto',
							autoclose: true,
							todayBtn: false,
							todayHighlight: true,
							weekStart: 1,
							language: 'it',
							forceParse: false
						});
						dpick.on('changeDate', function(ev) {
							fieldChanged(ev.date);
							dpick.off('changeDate');
							input.datepicker('remove');
							flagopen = false;
						});
						input.datepicker('show');
					} else {
						// case date time
						var dpick = input.datetimepicker({
							format: scope.flexdatetimeformatviz,
							showMeridian: false,
							autoclose: true,
							todayBtn: true,
							todayHighlight: true,
							language: 'it',
							minuteStep: 5,
							weekStart: 1,
							pickerPosition: 'bottom-left'
						});
						dpick.on('changeDate', function(ev) {
							fieldChanged(ev.date);
							dpick.off('changeDate');
							input.datetimepicker('remove');
							flagopen = false;
						});
						input.datetimepicker('show');
					}
					flagopen = true;
				} else {
					if (!scope.flexincludetime) {
						input.datepicker('remove');
					} else {
						input.datetimepicker('remove');
					}
					flagopen = false;
				}
			});

			scope.$watch('flexmodel', function(newval) {
				if (checkErr(newval)) {
					if (_.str.isBlank(newval)) {
						input.val(null);
					} else {
						var datemom = moment(newval, scope.flexdatetimeformatout, true);
						if (datemom.isValid()) {
							input.val(datemom.format(scope.flexdatetimeformatmom));
						} else {
							input.val(newval);
						}
					}
				} else {
					input.val(newval);
				}
			});

		}
	};
}]);

/**
 * Directive to generate a datetime field in a flexform
 *
 */
appFlexform.directive('flexformFieldTime', ['$translate', function($translate){
	return {
		restrict: 'ECMA',
		replace: true,
		require: 'ngModel',
		template:
			'<div>' +
				'<div class="form-group">' +
				'<label ng-show="flexlabel">' +
				'<span class="flexlabeltext" ng-show="flexlabel">{{flexviztype.pretext}}{{flexlabel}}{{flexviztype.posttext}}</span>' +
				'<a ng-show="flexdescr"> <span tooltip-placement="bottom" tooltip="{{flexdescr}}" class="flexinfotip"><span class="glyphicon glyphicon-info-sign" style="color: #aaaaaa;"></span></span></a> '+
				'<a ng-hide="flexvalid"> <span tooltip-placement="right" tooltip="{{flexerr}}" class="flexerrtip"><span class="glyphicon glyphicon-warning-sign" style="color: #A94442;"></span></span></a>'+
				'</label>' +
				'<div ng-show="flexformenabled" class="input-group">' +
				'<input type="text" name="{{name}}" data-minute-step="{{flexminutestep}}" data-default-time="{{flexdefaulttime}}" data-show-meridian="false" ng-model="flexmodel" ng-class="{classflexinvalid: !flexvalid}" class="form-control classflexfield timepickerinput" />' +
				'<span class="input-group-addon"><span class="glyphicon glyphicon-time"></span></span>' +
				'</div>' +
				'<div ng-hide="flexformenabled" class="classflextext">{{flexmodel | flexformFieldView:\'datetime\':flexviztype}}</div>' +
				'</div>' +
				'</div>',
		scope: {
			flexmodel: '=ngModel',
			flexrequired: '=ngRequired',
			name: '@',
			placeholder: '@',
			flexlabel: '=',
			flexdescr: '=',
			flextype: '=',
			flexformenabled: '=',
			flextimeformatviz: '@',
			flextimeformatout: '@',
			flextimeformatmom: '@',
			flexdefaulttime: '@',
			flexshowmeridian: '=',
			flexminutestep: '@'
		},
		link: function(scope, element, attrs, ngModel) {
			var setError = function(errflag, msg) {
				if (errflag) {
					if (msg) {
						scope.flexerr = msg;
					} else {
						scope.flexerr = $translate('GENERAL.FORM.FORMFIELDERROR');
					}
					ngModel.$setValidity('apperr', false);
				} else {
					ngModel.$setValidity('apperr', true);
				}
			};

			scope.$watch(function(){return ngModel.$valid;}, function(newval) {
				scope.flexvalid = newval;
			});

			var checkErr = function(datef) {
				if (_.str.isBlank(datef)) {
					if (scope.flexrequired) {
						setError(true, $translate('GENERAL.FORM.FORMFIELDMANDATORY'));
						return false;
					} else {
						setError(false);
						return true;
					}
				} else {
					var datemom = moment(datef, scope.flextimeformatout, true);

					if (datemom.isValid()) {
						setError(false);
						return true;
					} else {
						setError(true, $translate('GENERAL.FORM.FORMFIELDFORMATNOTVALID'));
						return false;
					}
				}
			};

			var updateModel = function(time) {
				checkErr(time);

				if (time) {
					scope.$apply(function () {
						scope.flexmodel = time;
					});
				}
			};

			// prepare field
			var elems = element.children();
			var input = elems.find('.timepickerinput');
			var butt = input.next();
			scope.flexviztype = angular.copy(scope.flextype);
			if (!scope.flexviztype) {
				scope.flexviztype = {};
			}

			if(scope.flexviztype.pretext)  scope.flexviztype.pretext  = "(" + scope.flexviztype.pretext + ") ";
			if(scope.flexviztype.posttext) scope.flexviztype.posttext = " (" + scope.flexviztype.posttext + ")";
			if(scope.flexviztype.initval) scope.flexmodel = scope.flexviztype.initval;

			//console.log(scope.flexminutestep);
			if (!scope.flexminutestep) {
				scope.flexminutestep = 5;
			} else {
				scope.flexminutestep = parseInt(scope.flexminutestep);
			}
			//console.log(scope.flexminutestep);
			if (!scope.showMeridian) {
				scope.showMeridian = false;
			}

			input.bind('blur keyup', function() {
				updateModel(input.val());
			});

			butt.bind('click', function() {
				input.timepicker({
					// minuteStep: scope.flexminutestep,
					template: 'dropdown',
					showSeconds: false,
					showMeridian: scope.flexshowmeridian
				});
				if (!scope.flexmodel) {
					if (scope.flexdefaulttime) {
						scope.flexmodel = scope.flexdefaulttime;
					} else {
						scope.flexmodel = '01:00';
					}
				}
				input.timepicker('showWidget');
			});

			scope.$watch('flexmodel', function(newval) {
				checkErr(newval);
			});

		}
	};
}]);

/**
 * Directive to generate a list field in a flexform
 *
 */
appFlexform.directive('flexformFieldDropdown', ['$translate', function($translate){
	return {
		restrict: 'ECMA',
		replace: true,
		require: 'ngModel',
		template:
			'<div>' +
				'<div class="form-group">' +
				'<label ng-show="flexlabel">' +
				'<span class="flexlabeltext">{{flexviztype.pretext}}{{flexlabel}}{{flexviztype.posttext}}</span>' +
				'<a ng-show="flexdescr"> <span tooltip-placement="bottom" tooltip="{{flexdescr}}" class="flexinfotip"><span class="glyphicon glyphicon-info-sign" style="color: #aaaaaa;"></span></span></a> '+
				'<a ng-hide="flexvalid"> <span tooltip-placement="right" tooltip="{{flexerr}}" class="flexerrtip"><span class="glyphicon glyphicon-warning-sign" style="color: #A94442;"></span></span></a>'+
				'</label>' +
				'<select name="{{name}}" ng-model="flexmodel" ng-show="flexformenabled" ng-options="(listitem.value).toString() as listitem.text for listitem in flextype.list" ng-class="{classflexinvalid: !flexvalid}" class="form-control classflexfield">' +
				'<option value=""></option>' +
				'</select>' +
				'<div ng-hide="flexformenabled" class="classflextext">{{flexmodel | flexformFieldView:\'dropdown\':flexviztype}}</div>' +
				'</div>' +
				'</div>',
		scope: {
			flexmodel: '=ngModel',
			flexrequired: '=ngRequired',
			name: '@',
			placeholder: '@',
			flexlabel: '=',
			flexdescr: '=',
			flextype: '=',
			flexformenabled: '='
		},
		link: function(scope, element, attrs, ngModel) {
			scope.flexerr = $translate('GENERAL.FORM.FORMFIELDMANDATORY');

			scope.$watch(function(){return ngModel.$valid;}, function(newval) {
				scope.flexvalid = newval;
			});

			// prepare the field
			scope.flexviztype = angular.copy(scope.flextype);
			if (!scope.flexviztype) {
				scope.flexviztype = {};
			}

			if(scope.flexviztype.pretext)  scope.flexviztype.pretext  = "(" + scope.flexviztype.pretext + ") ";
			if(scope.flexviztype.posttext) scope.flexviztype.posttext = " (" + scope.flexviztype.posttext + ")";
			if(scope.flexviztype.initval) scope.flexmodel = scope.flexviztype.initval;
		}
	};
}]);

/**
 * Directive to generate a string field in a flexform
 *
 */
appFlexform.directive('flexformFieldList', ['$translate', function($translate){
	return {
		restrict: 'ECMA',
		replace: true,
		require: 'ngModel',
		template:
			'<div>' +
				'<div class="form-group">' +
				'<label ng-show="flexlabel">' +
				'<span class="flexlabeltext">{{flexviztype.pretext}}{{flexlabel}}{{flexviztype.posttext}}</span>' +
				'<a ng-show="flexdescr"> <span tooltip-placement="bottom" tooltip="{{flexdescr}}" class="flexinfotip"><span class="glyphicon glyphicon-info-sign" style="color: #aaaaaa;"></span></span></a> '+
				'<a ng-hide="flexvalid"> <span tooltip-placement="right" tooltip="{{flexerr}}" class="flexerrtip"><span class="glyphicon glyphicon-warning-sign" style="color: #A94442;"></span></span></a>'+
				'</label>' +
				'<div ng-show="flexformenabled" class="input-group">' +
				'<div class="input-group-btn">' +
				'<button class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>' +
				'<ul class="dropdown-menu">' +
				'<li ng-repeat="listitem in flextype.list" class="flexlistelem"><a data-listvalue="{{listitem.value}}" href="">{{listitem.text}}</a></li>' +
				'</ul>' +
				'</div>' +
				'<input type="text" name="{{name}}" ng-model="flexmodel" ng-class="{classflexinvalid: !flexvalid}" class="form-control classflexfield" placeholder="{{placeholder}}">' +
				'</div>' +
				'<div ng-hide="flexformenabled" class="classflextext">{{flexmodel | flexformFieldView:\'list\':flexviztype}}</div>' +
				'</div>' +
				'</div>',
		scope: {
			flexmodel: '=ngModel',
			flexrequired: '=ngRequired',
			name: '@',
			placeholder: '@',
			flexlabel: '=',
			flexdescr: '=',
			flextype: '=',
			flexformenabled: '='
		},
		link: function(scope, element, attrs, ngModel) {

			scope.flexerr = $translate('GENERAL.FORM.FORMFIELDMANDATORY');

			scope.$watch(function(){return ngModel.$valid;}, function(newval) {
				scope.flexvalid = newval;
			});

			var updateModel = function(data) {
				scope.$apply(function () {
					scope.flexmodel = data;
				});
			};

			// prepare the field
			var dropdown = element.find('.dropdown-menu');
			scope.flexviztype = angular.copy(scope.flextype);
			if (!scope.flexviztype) {
				scope.flexviztype = {};
			}
			if(scope.flexviztype.pretext)  scope.flexviztype.pretext  = "(" + scope.flexviztype.pretext + ") ";
			if(scope.flexviztype.posttext) scope.flexviztype.posttext = " (" + scope.flexviztype.posttext + ")";
			if(scope.flexviztype.initval) scope.flexmodel = scope.flexviztype.initval;

			dropdown.bind('click', function(e) {
				var newval = jQuery(e.target).data('listvalue');
				updateModel(newval.toString());
			});
		}
	};
}]);

/**
 * Directive to generate a switch field in a flexform (isnull validation non implemented)
 *
 */
appFlexform.directive('flexformFieldSwitch', ['$translate', function($translate){
	return {
		restrict: 'ECMA',
		replace: true,
		require: 'ngModel',
		template:
			'<div>' +
				'<div class="form-group">' +
				'<label ng-show="flexlabel">' +
				'<span class="flexlabeltext">{{flexviztype.pretext}}{{flexlabel}}{{flexviztype.posttext}}</span>' +
				'<a ng-show="flexdescr"> <span tooltip-placement="bottom" tooltip="{{flexdescr}}" class="flexinfotip"><span class="glyphicon glyphicon-info-sign" style="color: #aaaaaa;"></span></span></a> '+
				'<a ng-hide="flexvalid"> <span tooltip-placement="right" tooltip="{{flexerr}}" class="flexerrtip"><span class="glyphicon glyphicon-warning-sign" style="color: #A94442;"></span></span></a>'+
				'</label>' +
				'<div ng-show="flexformenabled">' +
				'<bs-switch ng-model="flexmodel" switch-on-label="<span class=\'glyphicon glyphicon-ok\'></span>" switch-off-label="<span class=\'glyphicon glyphicon-remove\'></span>" type="checkbox"></bs-switch>' +
				'</div>' +
				'<div ng-hide="flexformenabled" class="classflextext" ng-bind-html="flexmodel | flexformFieldView:\'switch\':flexviztype"></div>' +
				'</div>' +
				'</div>',
		scope: {
			flexmodel: '=ngModel',
			flexrequired: '=ngRequired',
			name: '@',
			placeholder: '@',
			flexlabel: '=',
			flexdescr: '=',
			flextype: '=',
			flexformenabled: '='
		},
		link: function(scope, element, attrs, ngModel) {

			scope.flexerr = $translate('GENERAL.FORM.FORMFIELDMANDATORY');

			scope.$watch(function() {return ngModel.$valid;}, function(newval) {
				scope.flexvalid = newval;
			});

			scope.$watch('flexmodel', function() {
				if (scope.flexmodel && !_.isBoolean(scope.flexmodel)) {
					scope.flexmodel = parseInt(scope.flexmodel);
				}
			});

			// prepare the field
			scope.flexviztype = angular.copy(scope.flextype);
			if (!scope.flexviztype) {
				scope.flexviztype = {};
			}
			if(scope.flexviztype.pretext)  scope.flexviztype.pretext  = "(" + scope.flexviztype.pretext + ") ";
			if(scope.flexviztype.posttext) scope.flexviztype.posttext = " (" + scope.flexviztype.posttext + ")";
			if(scope.flexviztype.initval) scope.flexmodel = scope.flexviztype.initval;
		}
	};
}]);

/**
 * Directive to generate a external web page in a flexform
 *
 */
appFlexform.directive('flexformExtWeb', function() {
	return {
		restrict: 'ECMA',
		replace: true,
		template:
			'<div>' +
				'<ng-include src="flexextpathcss"></ng-include>' +
				'<ng-include src="flexextpath"></ng-include>' +
				'<ng-include src="flexextpathjs"></ng-include>' +
			'</div>',
		scope: {
			flexextpath: '@',
			flexextpathjs: '@',
			flexextpathcss: '@',
			flexmodel: '=',
			flexextname: '=',
			flexreadyform: '@',
			flexinjectform: '@',
			flexreturnform: '@'
		},
		link: function(scope) {
			var body = $('body');
			console.log(scope);
			
			// called when the flex webview is ready
			body.off(scope.flexreadyform);
			body.on(scope.flexreadyform, function(e) {
				console.log('webview form loaded arrived on directive: ' + scope.flexreadyform);
				// called when the model is updated from external (when the user null the update)
				scope.$watch('flexmodel', function() {
					console.log('data sent to the webview form fron directive: ' + scope.flexinjectform);
					$('body').trigger(scope.flexinjectform, [scope.flexmodel]);
				});
			});
			
			// called when the flex webview returns values
			body.off(scope.flexreturnform);
			body.on(scope.flexreturnform, function(e, data) {
				console.log('data received from the web view to update: ' + scope.flexreturnform);
				updateModel(data);
			});

			var updateModel = function(data) {
				scope.$apply(function () {
					scope.flexmodel = data;
				});
			};

		}
	};
});

/**
 * Directive to to visualize an external web page in a flexform
 *
 */
appFlexform.directive('flexformExtWebRead', function() {
	return {
		restrict: 'ECMA',
		replace: true,
		template:
			'<div>' +
				'<ng-include src="flexextpathcss"></ng-include>' +
				'<ng-include src="flexextpath"></ng-include>' +
				'<ng-include src="flexextpathjs"></ng-include>' +
			'</div>',
		scope: {
			flexextpath: '@',
			flexextpathjs: '@',
			flexextpathcss: '@',
			flexmodel: '=',
			flexextname: '=',
			flexreadyviz: '@',
			flexinjectviz: '@'
		},
		link: function(scope) {
			var body = $('body');
			console.log(scope);
			
			// called when the flex webview is ready
			body.off(scope.flexreadyviz);
			body.on(scope.flexreadyviz, null, null, function() {
				// called when the model is updated from external (when the user null the update)
				console.log('webview viz loaded arrived on directive: ' + scope.flexreadyviz);
				scope.$watch('flexmodel', function() {
					console.log('data sent to the webview viz fron directive: ' + scope.flexinjectviz);
					$('body').trigger(scope.flexinjectviz, [scope.flexmodel]);
				});
			});
			
			$('#testtest').on('click', function() {
				alert('fff');
			});

		}
	};
});

/**
 * Directive to generate a multi field in a flexform
 *
 */
appFlexform.directive('flexformFieldMulti', ['$translate', function(){
	return {
		restrict: 'ECMA',
		replace: true,
		require: '?ngModel',
		template: '<div class="col-sm-12">' +
			'<div class="classflexfield">' +
			'<div ng-show="flexformenabled"><button class="btn btn-primary" ng-click="addRow()"><span class="glyphicon glyphicon-plus"></span></button></div>' +
			'<div>' +
			'<div ng-repeat="row in flexmodel" style="margin-top:20px;">' +
			'<div style="width: 95%;">' +
			'<div ng-class="flex_field.classweb" ng-repeat="flex_field in flexmultilayout">' +
			'<div ng-switch on="flexform.schema.properties[flex_field.value].type">' +
			'<div ng-switch-when="string">' +
			'<div ng-model="row[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_field.label" ' +
			'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
			'flextype="flexform.schema.properties[flex_field.value]" ' +
			'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-string></div>' +
			'</div>' +
			'<div ng-switch-when="textarea">' +
			'<div ng-model="row[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_field.label" ' +
			'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
			'flextype="flexform.schema.properties[flex_field.value]"  ' +
			'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-textarea></div>' +
			'</div>' +
			'<div ng-switch-when="date">' +
			'<div ng-model="row[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_field.label" ' +
			'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
			'flexdatetimeformatviz="{{cultureformats.dateFormat}}" flexdatetimeformatmom="{{cultureformats.dateFormatMomentjs}}" ' +
			'flexdatetimeformatout="{{cultureformats.dateFormatFlexschemaOut}}" flexincludetime="false" flextype="flexform.schema.properties[flex_field.value]"  ' +
			'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-datetime></div>' +
			'</div>' +
			'<div ng-switch-when="datetime">' +
			'<div ng-model="row[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_field.label" ' +
			'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
			'flexdatetimeformatviz="{{cultureformats.datetimeFormat}}" flexdatetimeformatmom="{{cultureformats.datetimeFormatMomentjs}}" ' +
			'flexdatetimeformatout="{{cultureformats.datetimeFormatFlexschemaOut}}" flexincludetime="true" flextype="flexform.schema.properties[flex_field.value]" ' +
			'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-datetime></div>' +
			'</div>' +
			'<div ng-switch-when="time">' +
			'<div ng-model="flexmodel[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_label.text" ' +
			'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" flexminutestep="{{flexform.schema.properties[flex_field.value].minutestep}}"' +
			'flextimeformatviz="{{cultureformats.timeFormat}}" flextimeformatmom="{{cultureformats.timeFormatMomentjs}}" ' +
			'flextimeformatout="{{cultureformats.timeFormatFlexformOut}}" flextype="flexform.schema.properties[flex_field.value]" ' +
			'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-time></div>' +
			'</div>' +
			'<div ng-switch-when="list">' +
			'<div ng-model="row[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_field.label" ' +
			'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
			'flextype="flexform.schema.properties[flex_field.value]" ' +
			'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-list></div>' +
			'</div>' +
			'<div ng-switch-when="dropdown">' +
			'<div ng-model="row[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_field.label" ' +
			'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
			'flextype="flexform.schema.properties[flex_field.value]" ' +
			'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-dropdown></div>' +
			'</div>' +
			'<div ng-switch-when="switch">' +
			'<div ng-model="row[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_field.label" ' +
			'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
			'flextype="flexform.schema.properties[flex_field.value]" ' +
			'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-switch></div>' +
			'</div>' +
			'<div ng-switch-when="currency">' +
			'<div ng-model="row[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_field.label" ' +
			'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
			'flexcurrencycode="{{cultureformats.currencyparams.currency.symbol}}" flexdecimalsep="{{cultureformats.currencyparams.delimiters.decimal}}" ' +
			'flextype="flexform.schema.properties[flex_field.value]" flexthousandsep="{{cultureformats.currencyparams.delimiters.thousands}}"' +
			'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-currency></div>' +
			'</div>' +
			'<div ng-switch-when="numeral">' +
			'<div ng-model="row[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_field.label" ' +
			'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
			'flexdecimalsep="{{cultureformats.currencyparams.delimiters.decimal}}" ' +
			'flextype="flexform.schema.properties[flex_field.value]" flexthousandsep="{{cultureformats.currencyparams.delimiters.thousands}}"' +
			'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-numeral></div>' +
			'</div>' +
			'<div ng-switch-when="range">' +
			'<div ng-model="row[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_field.label" ' +
			'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
			'flextype="flexform.schema.properties[flex_field.value]" ' +
			'flexdecimalsep="{{cultureformats.currencyparams.delimiters.decimal}}" ' +
			'flexthousandsep="{{cultureformats.currencyparams.delimiters.thousands}}"' +
			'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-range></div>' +
			'</div>' +
			'<div ng-switch-when="calculated">' +
			'<div ng-model="row[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_field.label" ' +
			'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
			'flextype="flexform.schema.properties[flex_field.value]" ' +
			'flexformarr="flexform" flextypearr="flexform.schema.properties" ' +
			'flexdecimalsep="{{cultureformats.currencyparams.delimiters.decimal}}" ' +
			'flexthousandsep="{{cultureformats.currencyparams.delimiters.thousands}}"' +
			'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-calculated></div>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'<div style="float: right;"><button class="btn btn-danger" ng-click="deleteRow(row)"><span class="glyphicon glyphicon-trash"></span></button></div>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>',
		scope: {
			flexmodel: '=ngModel',
			flexrequired: '=ngRequired',
			name: '@',
			flexformenabled: '=',
			flexmultilayout: '=',
			flexform: '=',
			cultureformats: '='
		},
		link: function(scope) {

			if (!scope.flexmodel) {
				scope.flexmodel = [];
			}

			scope.addRow = function() {
				scope.flexmodel.push({});
			};

			scope.deleteRow = function(e) {
				var index = scope.flexmodel.indexOf(e);
				if (index > -1) {
					scope.flexmodel.splice(index, 1);
				}
			};

		}
	};
}]);

/**
 * Directive to generate a flex form from a flexform json schema for exam
 *
 */
appFlexform.directive('flexformForm', ['$translate', function(){
	return {
		restrict: 'ECMA',
		replace: true,
		require: '?ngModel',
		template: 
			'<div class="flexForm formwinedit" style="padding-top: 10px;">' +
				'<tabset>' +
				'<tab ng-repeat="flex_tab in flexform.schemaTab">' +
				'<tab-heading>' +
				'{{flex_tab.name}}' +
				'</tab-heading>' +
				'<div style="position: absolute; left: 0px; right: 0px; top: 50px; bottom: 0px; overflow-y: scroll;">' +
				'<div class="flexMainsect container-fluid" ng-repeat="flex_mainsectname in flex_tab.mainsects">' +
				'<h3>' +
				'{{flexform.schemaForm[flex_mainsectname].text.value}}' +
				'</h3>' +
				'<div style="overflow: visible;">' +
				'<div ng-switch on="!flexform.schemaForm[flex_mainsectname].extpath_form_html">' +
					'<div ng-switch-when="false">' +
						'<div ng-show="flexformenabled" flexmodel="flexmodel[flexform.schemaForm[flex_mainsectname].value]" flexextname="flexmodel[flexform.schemaForm[flex_mainsectname].extfolder]" ' + 
							'flexreadyform="{{flexform.schemaForm[flex_mainsectname].flexready_form}}" flexinjectform="{{flexform.schemaForm[flex_mainsectname].flexinject_form}}" flexreturnform="{{flexform.schemaForm[flex_mainsectname].flexreturn_form}}" ' +
							'flexextpathjs="../sync/flexform/{{flexform.schemaForm[flex_mainsectname].extlang}}/{{flexform.schemaForm[flex_mainsectname].exttype}}/extflexfile/{{flexform.schemaForm[flex_mainsectname].extpath_form_js}}" ' +
							'flexextpathcss="../sync/flexform/{{flexform.schemaForm[flex_mainsectname].extlang}}/{{flexform.schemaForm[flex_mainsectname].exttype}}/extflexfile/{{flexform.schemaForm[flex_mainsectname].extpath_form_css}}" ' +
							'flexextpath="../sync/flexform/{{flexform.schemaForm[flex_mainsectname].extlang}}/{{flexform.schemaForm[flex_mainsectname].exttype}}/extflexfile/{{flexform.schemaForm[flex_mainsectname].extpath_form_html}}" ' +
						'flexform-ext-web></div>' +
						'<div ng-hide="flexformenabled" flexmodel="flexmodel[flexform.schemaForm[flex_mainsectname].value]" flexextname="flexmodel[flexform.schemaForm[flex_mainsectname].extfolder]"' +
							'flexreadyviz="{{flexform.schemaForm[flex_mainsectname].flexready_viz}}" flexinjectviz="{{flexform.schemaForm[flex_mainsectname].flexinject_viz}}" ' +
							'flexextpathjs="../sync/flexform/{{flexform.schemaForm[flex_mainsectname].extlang}}/{{flexform.schemaForm[flex_mainsectname].exttype}}/extflexfile/{{flexform.schemaForm[flex_mainsectname].extpath_viz_js}}" ' +
							'flexextpathcss="../sync/flexform/{{flexform.schemaForm[flex_mainsectname].extlang}}/{{flexform.schemaForm[flex_mainsectname].exttype}}/extflexfile/{{flexform.schemaForm[flex_mainsectname].extpath_viz_css}}" ' +
							'flexextpath="../sync/flexform/{{flexform.schemaForm[flex_mainsectname].extlang}}/{{flexform.schemaForm[flex_mainsectname].exttype}}/extflexfile/{{flexform.schemaForm[flex_mainsectname].extpath_viz_html}}" ' +
						'flexform-ext-web-read></div>' +
				'</div>' +
				'<div ng-switch-when="true">' +
				'<div class="flexColumn {{flex_column.classweb}}" style="{{flex_column.layoutweb}}" ng-repeat="flex_column in flexform.schemaForm[flex_mainsectname].columns">' +
				'<h4>' +
				'{{flex_column.text.value}}' +
				'</h4>' +
				'<div class="flexSection row" ng-repeat="flex_section in flex_column.sections">' +
				'<h5>' +
				'{{flex_section.text.value}}' +
				'</h5>' +
				'<div class="flexRow" ng-repeat="flex_row in flex_section.rows">' +
				'<div ng-repeat="flex_label in flex_row.labels">' +
				'<div class="col-sm-12" ng-repeat="flex_field in flex_row.fields">' +
				'<div ng-switch on="flexform.schema.properties[flex_field.value].type">' +
				'<div ng-switch-when="string">' +
				'<div ng-model="flexmodel[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_label.text" ' +
				'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
				'flextype="flexform.schema.properties[flex_field.value]" placeholder="{{flex_field.hinttext}}" ' +
				'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-string></div>' +
				'</div>' +
				'<div ng-switch-when="textarea">' +
				'<div ng-model="flexmodel[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_label.text" ' +
				'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
				'flextype="flexform.schema.properties[flex_field.value]" placeholder="{{flex_field.hinttext}}" ' +
				'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-textarea></div>' +
				'</div>' +
				'<div ng-switch-when="date">' +
				'<div ng-model="flexmodel[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_label.text" ' +
				'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
				'flexdatetimeformatviz="{{cultureformats.dateFormat}}" flexdatetimeformatmom="{{cultureformats.dateFormatMomentjs}}" ' +
				'flexdatetimeformatout="{{cultureformats.dateFormatFlexschemaOut}}" flexincludetime="false" flextype="flexform.schema.properties[flex_field.value]" placeholder="{{flex_field.hinttext}}" ' +
				'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-datetime></div>' +
				'</div>' +
				'<div ng-switch-when="datetime">' +
				'<div ng-model="flexmodel[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_label.text" ' +
				'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
				'flexdatetimeformatviz="{{cultureformats.datetimeFormat}}" flexdatetimeformatmom="{{cultureformats.datetimeFormatMomentjs}}" ' +
				'flexdatetimeformatout="{{cultureformats.datetimeFormatFlexschemaOut}}" flexincludetime="true" flextype="flexform.schema.properties[flex_field.value]" placeholder="{{flex_field.hinttext}}" ' +
				'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-datetime></div>' +
				'</div>' +
				'<div ng-switch-when="time">' +
				'<div ng-model="flexmodel[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_label.text" ' +
				'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" flexminutestep="{{flexform.schema.properties[flex_field.value].minutestep}}" ' +
				'flextimeformatviz="{{cultureformats.timeFormat}}" flextimeformatmom="{{cultureformats.timeFormatMomentjs}}" ' +
				'flextimeformatout="{{cultureformats.timeFormatFlexformOut}}" flextype="flexform.schema.properties[flex_field.value]" placeholder="{{flex_field.hinttext}}" ' +
				'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-time></div>' +
				'</div>' +
				'<div ng-switch-when="list">' +
				'<div ng-model="flexmodel[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_label.text" ' +
				'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
				'flextype="flexform.schema.properties[flex_field.value]" placeholder="{{flex_field.hinttext}}" ' +
				'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-list></div>' +
				'</div>' +
				'<div ng-switch-when="dropdown">' +
				'<div ng-model="flexmodel[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_label.text" ' +
				'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
				'flextype="flexform.schema.properties[flex_field.value]" placeholder="{{flex_field.hinttext}}" ' +
				'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-dropdown></div>' +
				'</div>' +
				'<div ng-switch-when="switch">' +
				'<div ng-model="flexmodel[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_label.text" ' +
				'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
				'flextype="flexform.schema.properties[flex_field.value]" placeholder="{{flex_field.hinttext}}" ' +
				'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-switch></div>' +
				'</div>' +
				'<div ng-switch-when="numeral">' +
				'<div ng-model="flexmodel[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_label.text" ' +
				'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
				'flexdecimalsep="{{cultureformats.currencyparams.delimiters.decimal}}" ' +
				'flextype="flexform.schema.properties[flex_field.value]" flexthousandsep="{{cultureformats.currencyparams.delimiters.thousands}}" placeholder="{{flex_field.hinttext}}" ' +
				'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-numeral></div>' +
				'</div>' +
				'<div ng-switch-when="currency">' +
				'<div ng-model="flexmodel[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_label.text" ' +
				'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
				'flexcurrencycode="{{cultureformats.currencyparams.currency.symbol}}" flexdecimalsep="{{cultureformats.currencyparams.delimiters.decimal}}" ' +
				'flextype="flexform.schema.properties[flex_field.value]" flexthousandsep="{{cultureformats.currencyparams.delimiters.thousands}}" placeholder="{{flex_field.hinttext}}" ' +
				'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-currency></div>' +
				'</div>' +
				'<div ng-switch-when="range">' +
				'<div ng-model="flexmodel[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_label.text" ' +
				'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
				'flexdecimalsep="{{cultureformats.currencyparams.delimiters.decimal}}" ' +
				'flexthousandsep="{{cultureformats.currencyparams.delimiters.thousands}}" ' +
				'flextype="flexform.schema.properties[flex_field.value]" placeholder="{{flex_field.hinttext}}" ' +
				'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-range></div>' +
				'</div>' +
				'<div ng-switch-when="calculated">' +
				'<div ng-model="flexmodel[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_label.text" ' +
				'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
				'flextype="flexform.schema.properties[flex_field.value]" ' +
				'flexmodelarr="flexmodel" flextypearr="flexform.schema.properties" ' +
				'flexdecimalsep="{{cultureformats.currencyparams.delimiters.decimal}}" ' +
				'flexthousandsep="{{cultureformats.currencyparams.delimiters.thousands}}" placeholder="{{flex_field.hinttext}}" ' +
				'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-calculated></div>' +
				'</div>' +
				'<div ng-switch-when="multi">' +
				'<div ng-model="flexmodel[flex_field.value]" name="{{flex_field.value}}" cultureformats="cultureformats" ' +
				'flexformenabled="flexformenabled" flexmultilayout="flex_field.cols" flexform="flexform" ' +
				'flextype="flexform.schema.properties[flex_field.value]" ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-multi></div>' +
				'</div>' +
				'</div>' +
				'</div>' +
				'</div>' +
				'</div>' +
				'</div>' +
				'</div>' +
				'</div>' +
				'</div>' +
				'</div>' +
				'</div>' +
				'</div>' +
				'</tab>' +
				'</tabset>' +
			'</div>',
		scope: {
			flexmodel: '=ngModel',
			flexform: '=',
			cultureformats: '=',
			flexformenabled: '='
		},
		link: function(scope, element, attrs, ngModel) {
			
		}
	};
}]);

/**
 * Directive to generate a flex form from a flexform json schema for measure
 *
 */
appFlexform.directive('flexformMain', ['$translate', function(){
	return {
		restrict: 'ECMA',
		replace: true,
		require: '?ngModel',
		template:
			'<div class="flexMainsect container-fluid" ng-repeat="(flex_mainsectname, flex_mainsectval) in flexform.schemaForm">' +
				'<h3>' +
				'{{flexform.schemaForm[flex_mainsectname].text.value}}' +
				'</h3>' +
				'<div style="overflow: visible;">' +
					'<div ng-switch on="!flexform.schemaForm[flex_mainsectname].extpath_form_html">' +
						'<div ng-switch-when="false">' +
							'<div ng-show="flexformenabled" flexmodel="flexmodel[flexform.schemaForm[flex_mainsectname].value]" flexextname="flexmodel[flexform.schemaForm[flex_mainsectname].extfolder]" ' + 
								'flexreadyform="{{flexform.schemaForm[flex_mainsectname].flexready_form}}" flexinjectform="{{flexform.schemaForm[flex_mainsectname].flexinject_form}}" flexreturnform="{{flexform.schemaForm[flex_mainsectname].flexreturn_form}}" ' +
								'flexextpathjs="../sync/flexform/{{flexform.schemaForm[flex_mainsectname].extlang}}/{{flexform.schemaForm[flex_mainsectname].exttype}}/extflexfile/{{flexform.schemaForm[flex_mainsectname].extpath_form_js}}" ' +
								'flexextpathcss="../sync/flexform/{{flexform.schemaForm[flex_mainsectname].extlang}}/{{flexform.schemaForm[flex_mainsectname].exttype}}/extflexfile/{{flexform.schemaForm[flex_mainsectname].extpath_form_css}}" ' +
								'flexextpath="../sync/flexform/{{flexform.schemaForm[flex_mainsectname].extlang}}/{{flexform.schemaForm[flex_mainsectname].exttype}}/extflexfile/{{flexform.schemaForm[flex_mainsectname].extpath_form_html}}" ' +
							'flexform-ext-web></div>' +
							'<div ng-hide="flexformenabled" flexmodel="flexmodel[flexform.schemaForm[flex_mainsectname].value]" flexextname="flexmodel[flexform.schemaForm[flex_mainsectname].extfolder]"' +
								'flexreadyviz="{{flexform.schemaForm[flex_mainsectname].flexready_viz}}" flexinjectviz="{{flexform.schemaForm[flex_mainsectname].flexinject_viz}}" ' +
								'flexextpathjs="../sync/flexform/{{flexform.schemaForm[flex_mainsectname].extlang}}/{{flexform.schemaForm[flex_mainsectname].exttype}}/extflexfile/{{flexform.schemaForm[flex_mainsectname].extpath_viz_js}}" ' +
								'flexextpathcss="../sync/flexform/{{flexform.schemaForm[flex_mainsectname].extlang}}/{{flexform.schemaForm[flex_mainsectname].exttype}}/extflexfile/{{flexform.schemaForm[flex_mainsectname].extpath_viz_css}}" ' +
								'flexextpath="../sync/flexform/{{flexform.schemaForm[flex_mainsectname].extlang}}/{{flexform.schemaForm[flex_mainsectname].exttype}}/extflexfile/{{flexform.schemaForm[flex_mainsectname].extpath_viz_html}}" ' +
							'flexform-ext-web-read></div>' +
					'</div>' +
					'<div ng-switch-when="true">' +
						'<div class="flexColumn {{flex_column.classweb}}" style="{{flex_column.layoutweb}}" ng-repeat="flex_column in flexform.schemaForm[flex_mainsectname].columns">' +
							'<h4>' +
								'{{flex_column.text.value}}' +
							'</h4>' +
							'<div class="flexSection row" ng-repeat="flex_section in flex_column.sections">' +
								'<h5>' +
									'{{flex_section.text.value}}' +
								'</h5>' +
								'<div class="flexRow" ng-repeat="flex_row in flex_section.rows">' +
									'<div ng-repeat="flex_label in flex_row.labels">' +
										'<div class="col-sm-12" ng-repeat="flex_field in flex_row.fields">' +
											'<div ng-switch on="flexform.schema.properties[flex_field.value].type">' +
												'<div ng-switch-when="string">' +
													'<div ng-model="flexmodel[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_label.text" ' +
													'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
													'flextype="flexform.schema.properties[flex_field.value]" placeholder="{{flex_field.hinttext}}" ' +
													'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-string></div>' +
												'</div>' +
												'<div ng-switch-when="textarea">' +
													'<div ng-model="flexmodel[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_label.text" ' +
													'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
													'flextype="flexform.schema.properties[flex_field.value]" placeholder="{{flex_field.hinttext}}" ' +
													'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-textarea></div>' +
												'</div>' +
												'<div ng-switch-when="date">' +
													'<div ng-model="flexmodel[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_label.text" ' +
													'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
													'flexdatetimeformatviz="{{cultureformats.dateFormat}}" flexdatetimeformatmom="{{cultureformats.dateFormatMomentjs}}" ' +
													'flexdatetimeformatout="{{cultureformats.dateFormatFlexschemaOut}}" flexincludetime="false" flextype="flexform.schema.properties[flex_field.value]" placeholder="{{flex_field.hinttext}}" ' +
													'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-datetime></div>' +
												'</div>' +
												'<div ng-switch-when="datetime">' +
													'<div ng-model="flexmodel[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_label.text" ' +
													'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
													'flexdatetimeformatviz="{{cultureformats.datetimeFormat}}" flexdatetimeformatmom="{{cultureformats.datetimeFormatMomentjs}}" ' +
													'flexdatetimeformatout="{{cultureformats.datetimeFormatFlexschemaOut}}" flexincludetime="true" flextype="flexform.schema.properties[flex_field.value]" placeholder="{{flex_field.hinttext}}" ' +
													'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-datetime></div>' +
												'</div>' +
												'<div ng-switch-when="time">' +
													'<div ng-model="flexmodel[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_label.text" ' +
													'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" flexminutestep="{{flexform.schema.properties[flex_field.value].minutestep}}" ' +
													'flextimeformatviz="{{cultureformats.timeFormat}}" flextimeformatmom="{{cultureformats.timeFormatMomentjs}}" ' +
													'flextimeformatout="{{cultureformats.timeFormatFlexformOut}}" flextype="flexform.schema.properties[flex_field.value]" placeholder="{{flex_field.hinttext}}" ' +
													'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-time></div>' +
												'</div>' +
												'<div ng-switch-when="list">' +
													'<div ng-model="flexmodel[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_label.text" ' +
													'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
													'flextype="flexform.schema.properties[flex_field.value]" placeholder="{{flex_field.hinttext}}" ' +
													'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-list></div>' +
												'</div>' +
												'<div ng-switch-when="dropdown">' +
													'<div ng-model="flexmodel[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_label.text" ' +
													'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
													'flextype="flexform.schema.properties[flex_field.value]" placeholder="{{flex_field.hinttext}}" ' +
													'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-dropdown></div>' +
												'</div>' +
												'<div ng-switch-when="switch">' +
													'<div ng-model="flexmodel[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_label.text" ' +
													'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
													'flextype="flexform.schema.properties[flex_field.value]" placeholder="{{flex_field.hinttext}}" ' +
													'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-switch></div>' +
												'</div>' +
												'<div ng-switch-when="numeral">' +
													'<div ng-model="flexmodel[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_label.text" ' +
													'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
													'flexdecimalsep="{{cultureformats.currencyparams.delimiters.decimal}}" ' +
													'flextype="flexform.schema.properties[flex_field.value]" flexthousandsep="{{cultureformats.currencyparams.delimiters.thousands}}" placeholder="{{flex_field.hinttext}}" ' +
													'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-numeral></div>' +
												'</div>' +
												'<div ng-switch-when="currency">' +
													'<div ng-model="flexmodel[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_label.text" ' +
													'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
													'flexcurrencycode="{{cultureformats.currencyparams.currency.symbol}}" flexdecimalsep="{{cultureformats.currencyparams.delimiters.decimal}}" ' +
													'flextype="flexform.schema.properties[flex_field.value]" flexthousandsep="{{cultureformats.currencyparams.delimiters.thousands}}" placeholder="{{flex_field.hinttext}}" ' +
													'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-currency></div>' +
												'</div>' +
												'<div ng-switch-when="range">' +
													'<div ng-model="flexmodel[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_label.text" ' +
													'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
													'flexdecimalsep="{{cultureformats.currencyparams.delimiters.decimal}}" ' +
													'flexthousandsep="{{cultureformats.currencyparams.delimiters.thousands}}" ' +
													'flextype="flexform.schema.properties[flex_field.value]" placeholder="{{flex_field.hinttext}}" ' +
													'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-range></div>' +
												'</div>' +
												'<div ng-switch-when="calculated">' +
													'<div ng-model="flexmodel[flex_field.value]" name="{{flex_field.value}}" flexlabel="flex_label.text" ' +
													'flexdescr="flexform.schema.properties[flex_field.value].description" flexformenabled="flexformenabled" ' +
													'flextype="flexform.schema.properties[flex_field.value]" ' +
													'flexmodelarr="flexmodel" flextypearr="flexform.schema.properties" ' +
													'flexdecimalsep="{{cultureformats.currencyparams.delimiters.decimal}}" ' +
													'flexthousandsep="{{cultureformats.currencyparams.delimiters.thousands}}" placeholder="{{flex_field.hinttext}}" ' +
													'ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-calculated></div>' +
												'</div>' +
												'<div ng-switch-when="multi">' +
													'<div ng-model="flexmodel[flex_field.value]" name="{{flex_field.value}}" cultureformats="cultureformats" ' +
													'flexformenabled="flexformenabled" flexmultilayout="flex_field.cols" flexform="flexform" ' +
													'flextype="flexform.schema.properties[flex_field.value]" ng-required="!flexform.schema.properties[flex_field.value].isnull" flexform-field-multi></div>' +
												'</div>' +
											'</div>' +
										'</div>' +
									'</div>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>',
		scope: {
			flexmodel: '=ngModel',
			flexform: '=',
			cultureformats: '=',
			flexformenabled: '='
		},
		link: function(scope, element, attrs) {

		}
	};
}]);