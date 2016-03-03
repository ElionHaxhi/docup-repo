function patientGraphCtrl($scope, App, Patient, Graphui, Flexschema, User, Exam, Flexmodel) {
	
	$scope.user 		= User;
	$scope.patient 		= Patient;
	$scope.exam 		= Exam;
	$scope.flexmodel	= Flexmodel;
	$scope.flexform 	= Flexschema.patient;
	$scope.flexformExam = Flexschema.exam;
	$scope.appgormats 	= App.params.formats;
	
	// graph params
	$scope.graphparam = {};
	$scope.graphparam.selectedFlexforms = {};
	$scope.graphparam.usedFlexforms	 	= {};
	$scope.graphparam.saveGraphName 	= [];
	
	// graph flot
	$scope.graph = {};
	$scope.graph.loadList = [];

	if (User.info.json_sync && User.info.json_sync.graphs) {
		$scope.graph.loadList = User.info.json_sync.graphs;
	}

	$scope.graph.saveGraphName = null;
	$scope.graph.opts = {
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
    		timeformat: "%m/%y",
    		minTickSize: [1, 'month'],
    		maxTickSize: [1, 'year'],
			autoscaleMargin: 0.02
		}
	};
	
	/*
	 * PUB FUNCS
	 */
	
	/**
	 * 
	 * 
	 */
	$scope.getFlextypeUsed = function(exam_count) {
		var elem = Exam.list[exam_count];
		if(exam_count >= 0){
			if(elem.jsondata_type){
				Flexschema.getFlexSchema('exam', elem.jsondata_type, null, function(ack, msg, flexform) {
					if (ack) {
						$scope.graphparam.usedFlexforms[elem.jsondata_type] = flexform;
					}
					$scope.getFlextypeUsed(exam_count - 1);

				});
			}
		}
		else{
			//Graphui.setLoading(false);
		}

		/*
		var flextypesusedarr = {};
		_.each(Exam.list, function(elem) {
			var flexobj = _.pick(elem, 'jsondata_type', 'flexformname');
			if (flexobj.jsondata_type && !flextypesusedarr[elem.jsondata_type]) {
				Flexschema.getFlexSchema('exam', elem.jsondata_type, null, function(ack, msg, flexform) {
					if (ack) {
						flextypesusedarr[elem.jsondata_type] = flexform;
					}
					//Graphui.setLoading(false);
				});
			}
		});
		*/
	};

	$scope.$watch('exam.list', function() {
		var exam_count = _.size(Exam.list) - 1;
		$scope.graphparam.usedFlexforms = {};
		$scope.getFlextypeUsed(exam_count);
	});

	/**
	  * Select flexform
	  * 
	  * @param {string} flexname flexform name
	  * @param {object} flexform
	  */
	$scope.selectFlexformFilter = function(flexname, flexform) {

		if (!$scope.graphparam.selectedFlexforms[flexname]) {
			//console.log(flexform);
			var selected = {};
			selected.propsSelected = {};
			selected.propsAvailable = flexform.schema.properties;

			Flexmodel.setFlexProperties(selected.propsAvailable);

			_.each(Flexmodel.getKeyvalProperties(), function(prop){
				if (!selected.propsSelected[prop.id]){
					selected.propsSelected[prop.id] = prop;
				}
			});

			$scope.graphparam.selectedFlexforms[flexname] = selected;
		} else {
			delete $scope.graphparam.selectedFlexforms[flexname];
		}

		//console.log($scope.graphparam.selectedFlexforms);
		$scope.refreshGraph();
	};
	
	$scope.checkFlexformFilter = function(flexname) {
		return $scope.graphparam.selectedFlexforms[flexname];
	};
	
	$scope.selectFlexPropFilter = function(flexform, id, obj) {
		if (!$scope.graphparam.selectedFlexforms[flexform].propsSelected[id]) {
			$scope.graphparam.selectedFlexforms[flexform].propsSelected[id] = obj;
		} else {
			delete $scope.graphparam.selectedFlexforms[flexform].propsSelected[id];
		}
		$scope.refreshGraph();
	};
	
	$scope.checkFlexPropFilter = function(flexform, id) {
		return $scope.graphparam.selectedFlexforms[flexform].propsSelected[id];
	};
	
	$scope.refreshGraph = function() {
		var graphdataarr = [];
		_.each($scope.graphparam.selectedFlexforms, function(flex, flexindex) {
			_.each(flex.propsSelected, function(prop, propindex) {
				var graphdata = [];
				_.each(Exam.list, function(exam) {
					if (exam.jsondata_type === flexindex) {
						var tick = moment(exam.examdate, 'YYYY-MM-DD HH:mm:ss').valueOf();
						var val = null;
						if (exam.jsondata) {
							var jsondata = JSON.parse(exam.jsondata);
							val = jsondata[propindex];
						}
						graphdata.push([tick, val]);
					}
				});
				var graphdata_sorted = _.sortBy(graphdata, 0);
				graphdataarr.push({
				    data: graphdata_sorted,
				    label: prop.description,
				    shadowSize: 0
				});
			});
		});
		$scope.graph.data = graphdataarr;
	};
	
	$scope.saveGraph = function() {
		//Graphui.setLoading(true);
		var paramObj = {
			graphname: $scope.graph.saveGraphName,
			graphdef: $scope.graphparam.selectedFlexforms
		};
		User.createUserSetting('GRAPHS', paramObj, function() {
			User.getUserInfo(function() {
				//Graphui.setLoading(false);
				$scope.graph.loadList = User.info.json_sync.graphs;
			});
		});
	};
	
	$scope.loadGraph = function(graphId) {
		if (graphId) {
			var graphObj = _.findWhere($scope.graph.loadList, {id: graphId});
			$scope.graphparam.selectedFlexforms.propsSelected = {};
			$scope.graphparam.selectedFlexforms = graphObj.jsondata.graphdef;
		} else {
			$scope.graphparam.selectedFlexforms = {};
		}
		$scope.refreshGraph();
	};
}