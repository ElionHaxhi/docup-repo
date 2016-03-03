var appFlexmodel = angular.module('appFlexmodel', []);

appFlexmodel.factory('Flexmodel', ['$http', '$location', '$translate', 'App', 'Config', 'Gendialog', 'User',
	function($http, $location, $translate, App, Config, Gendialog, User) {

		var flexmodel = {
			obj: null,
			props: {
				list: [],
				keyVals: [],
				validationRules: [],
				warningRules: []
			}
		};

		/**
		 *
		 *
		 */
		var cleanProperties = function() {
			flexmodel.props.list = [];
			flexmodel.props.keyVals = [];
			flexmodel.props.validationRules = [];
			flexmodel.props.warningRules = [];
		};

		/**
		 *
		 *
		 */
		var checkRule = function(formula) {
			try {
				var fullString = _.clone(formula);

				// replace the value in the rule string to eval
				for (var prop in flexmodel.props.list) {
					var regstr = "<!" + prop + "!>";
					var regexp = new RegExp(regstr, "g");

					fullString = fullString.replace(regexp, flexmodel.obj[prop]);
				}

				// check if no errors are present in the formula
				if (fullString.indexOf("<!") > -1) {
					return false;

				} else {
					return eval(fullString);
				}
			} catch(e) {
				return false;
			}
		};

		/**
		 *
		 *
		 */
		flexmodel.setFlexModel = function(flexobj) {
			flexmodel.obj = flexobj;
		};

		/**
		 *
		 *
		 */
		flexmodel.getFlexModel = function() {
			return flexmodel.obj;
		};

		/**
		 *
		 *
		 */
		flexmodel.setFlexProperties = function(flexproperties) {
			cleanProperties();
			flexmodel.props.list = flexproperties;

			//prepare:
			for (var prop in flexmodel.props.list) {
				if (flexmodel.props.list[prop].keyval) {
					flexmodel.props.list[prop].id = prop;
					flexmodel.props.keyVals.push(flexmodel.props.list[prop]);
				}

				if (flexmodel.props.list[prop].rules) {

					if (flexmodel.props.list[prop].rules.warnings) {
						for (var warn in flexmodel.props.list[prop].rules.warnings) {
							flexmodel.props.list[prop].rules.warnings[warn].id = prop;
							flexmodel.props.warningRules.push(flexmodel.props.list[prop].rules.warnings[warn]);
						}
					}

					if (flexmodel.props.list[prop].rules.validations) {
						for (var valid in flexmodel.props.list[prop].rules.validations) {
							flexmodel.props.list[prop].rules.validations[valid].id = prop;
							flexmodel.props.validationRules.push(flexmodel.props.list[prop].rules.validations[valid]);
						}
					}
				}
			}
		};

		/**
		 *
		 *
		 */
		flexmodel.getFlexProperties = function() {
			return flexmodel.props.list;
		};

		/**
		 *
		 *
		 */
		flexmodel.getKeyvalProperties = function() {
			return flexmodel.props.keyVals;
		};

		/**
		 *
		 *
		 */
		flexmodel.getKeyvals = function() {
			var arr = [];
			if(!_.isNull(flexmodel.obj)){
				for (var index in flexmodel.props.keyVals) {
					var propId 		= flexmodel.props.keyVals[index].id;
					var prop 		= flexmodel.props.keyVals[index];
					var formatval 	= '';

					if (prop.pretext)			formatval 	= formatval + prop.pretext + ' ';
					if (flexmodel.obj[propId]) 	formatval 	= formatval + flexmodel.obj[propId];
					if (prop.posttext) 			formatval 	= formatval + ' ' + prop.posttext;

					var obj = {
						id: propId,
						descr: prop.description,
						val: flexmodel.obj[propId],
						formattedVal: formatval
					};

					arr.push(obj);
				}
			}
			return arr;
		};

		/**
		 *
		 *
		 */
		flexmodel.getWarnings = function() {
			var warnings = [];
			if(!_.isNull(flexmodel.obj)){
				for (var warn in flexmodel.props.warningRules) {
					var warning = checkRule(flexmodel.props.warningRules[warn].formula);

					if (warning) {
						warnings.push(flexmodel.props.warningRules[warn].msg);
					}
				}
			}
			return warnings;
		};

		return flexmodel;
	}
]);