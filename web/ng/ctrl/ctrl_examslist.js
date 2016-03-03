function examsListCtrl($scope, $location, $routeParams, $modal, $translate, App, Navbar, Exam, Graphui, Gendialog, Patient, User, Flexschema) {
	
	/*
	 * SCOPE
	 */
	$scope.user = User;
	$scope.exam = Exam;
	$scope.patient = Patient;
	$scope.flexserv = Flexschema;
	$scope.currexam = null;
	$scope.appformats = App.params.formats;
	$scope.searchQuery = '';
	// prepare patients filter
	$scope.examtypes = angular.copy(User.getAllAppointsTypeData());
	
	/*
	 * PRIV FUNCS
	 */
	var callbackSaveEpisode = function(ack, msg) {
		if (ack) {
			$scope.refreshExamsList();
		} else {
			Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), msg);
		}
	};
	
	/*
	 * PUB FUNCS
	 */
	
	$scope.refreshExamsList = function() {
		Exam.clearExamsList();

		var examspatient = Patient.obj.id;
		if ($routeParams.patientid) {
			examspatient = $routeParams.patientid;
		}

		Exam.getAllExamsByPatientId(examspatient, "EXAM", function(ack, msg) {
			if (!ack) {
				Gendialog.openConfirmDialog($translate('GENERAL.ERR.SERVERFAIL'), msg);
			}
			else{
				Graphui.setLoading(false);

			}
		});
	};
	
	/**
	  * Create new exam
	  * 
	  */
	$scope.openCreateNewExam = function() {
		//Graphui.setLoading(true);
		var msgType = User.checkLicenseFreeLimit("EXA");
		if (!msgType) {
			$location.path('/examcreate/');
		} else {
			//Graphui.setLoading(false);
			Gendialog.openErrorLicenseFreeDialog(msgType);
		}
	};
	
	/**
	 * Get appoint type object
	 * 
	 * @param {string} typecode exam type code
	 */
	$scope.getExamTypeObj = function(typecode) {
		var typeobj = User.getAppointTypeData(typecode);
		if (typeobj) {
			return typeobj;
		} else {
			return null;
		}
	};
	
	/**
	 * Set exam type filter
	 * 
	 * @param {string} typecode exam type code
	 */
	$scope.setFilterExamType = function(typecode) {
		Exam.filter.examtype = typecode;
		// $scope.refreshExamsList();
	};
	
	/*
	 * EPISODES
	 */
	
	/**
	  * Open dialog to confirm episode delete
	  * 
	  * @param {string} episodeid
	  */
	$scope.openDialogDeleteConfirm = function(episodeid) {
		var dialogtitle = $translate('EXAM.MSG.DELEPISODECONFIRM_TITLE');
		var dialogmsg = $translate('EXAM.MSG.DELEPISODECONFIRM_QUEST');
		Gendialog.openConfirmDialog(dialogtitle, dialogmsg, $scope.deleteEpisode, [episodeid]);
	};
	
	/**
	  * Delete episode
	  * 
	  * @param {string} episodeid
	  */
	$scope.deleteEpisode = function(episodeid) {
		Exam.deleteEpisode(episodeid, callbackSaveEpisode);
	};
	
	/**
	  * Open dialog to create episode
	  * 
	  * @param {string} patientid
	  * @param {string} examid
	  */
	$scope.openDialogCreateEpisode = function(patientid, examid) {
        
        function episodeCreateDialogController($scope, $modalInstance) {
            $scope.newepisode = {};
            
            $scope.cancel = function(){
                $modalInstance.close();
            };
            
            $scope.save = function(result){
                Exam.createEpisode(patientid, examid, result, function() {
                	callbackSaveEpisode(true, null, null);
                	$modalInstance.close();
                });
            };
        }
        
        var modalInstance = $modal.open({
        	templateUrl: 'webapp/episodeedit',
	        controller: episodeCreateDialogController,
	        resolve: {
            	currexam: function() {
                	return angular.copy(examid);
				},
				newepisode: function() {
                	return  $scope.newepisode;
				}
            }
        });
    };
	
	/**
	  * Open dialog to create episode
	  * 
	  * @param {string} episodeId
	  * @param {string} episodeDescr
	  * @param {string} episodeNote
	  */
	$scope.openDialogUpdateEpisode = function(episodeId, episodeDescr, episodeNote) {
		var updepisode = {
        	id: episodeId,
        	descr: episodeDescr,
        	note: episodeNote
        };
        //console.log(updepisode);
		
        function episodeUpdateDialogController($scope, $modalInstance, newepisode) {
        	$scope.newepisode = newepisode;
        	
            $scope.cancel = function(){
                $modalInstance.close();
            };
            
            $scope.save = function(result){
            	result.id = episodeId;
                Exam.updateEpisode(result, function() {
                	callbackSaveEpisode(true, null);
                	$modalInstance.close();
                });
            };
        }
        
        var modalInstance = $modal.open({
        	templateUrl: 'webapp/episodeedit',
	        controller: episodeUpdateDialogController,
	        resolve: {
            	newepisode: function() {
                	return updepisode;
				}
            }
        });
    };
	
	/**
	  * Open dialog to select episode to link to an exam
	  * 
	  * @param {string} examid
	  */
	$scope.openDialogSelectEpisode = function(examid) {
        
        function episodeListDialogController($scope, $modalInstance, currexam, episodelist) {
            $scope.episodelist = episodelist;
            
             $scope.close = function(){
                $modalInstance.close();
            };
            
            $scope.assignExamToEpisode = function(episodeid) {
                //Graphui.setLoading(true);
                Exam.assignEpisode(episodeid, currexam, function(ack, msg) {
                    if (ack) {
						callbackSaveEpisode(true, null);
                        $modalInstance.close();
                    } else {
                        Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), msg);
                    }
                });
            };
        }
        
        var modalInstance = $modal.open({
        	templateUrl: 'webapp/episodeslist',
	        controller: episodeListDialogController,
	        resolve: {
            	currexam: function() {
                	return angular.copy(examid);
                },
                episodelist: function() {
                	return Exam.episodelist;
                }
            }
        });
    };
    
    /**
	  * Open dialog to confirm remove an exam from an episode
	  * 
	  * @param {string} examid
	  */
	$scope.openDialogRemoveEpisode = function(examid) {
    	var dialogtitle = $translate('EXAM.MSG.REMOVEEXAMFROMEPISODECONFIRM_TITLE');
		var dialogmsg = $translate('EXAM.MSG.REMOVEEXAMFROMEPISODECONFIRM_QUEST');
		Gendialog.openConfirmDialog(dialogtitle, dialogmsg, $scope.deassignExamFromEpisode, [examid]);
    };
    
    /**
	  * Remove an exam from an episode
	  * 
	  * @param {string} examid
	  */
	$scope.deassignExamFromEpisode = function(examid) {
		Exam.deassignExamFromEpisode(examid, function(ack, msg) {
			if (ack) {
				$scope.refreshExamsList();
			} else {
				Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), msg);
			}
		});
	};
	
	// executed from the route
	Navbar.setTabSelected('exams');
	Graphui.setLoading(true);

	/*if ($routeParams.patientid) {
		$scope.refreshExamsList();
	} else {
		if (!Exam.list || $location.path() === '/examslist/refresh/') {
			$scope.refreshExamsList();
		} else {
			Graphui.setLoading(false);
		}
	}*/

	if (true) {
		$scope.refreshExamsList();
	} else {
		if (!Exam.list || $location.path() === '/examslist/refresh/') {
			$scope.refreshExamsList();
		} else {
			Graphui.setLoading(false);
		}
	}

}

