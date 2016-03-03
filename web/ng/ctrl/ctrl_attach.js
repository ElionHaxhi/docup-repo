function attachCtrl($http, $filter, $window, $rootScope, $scope, $location, $modal, $translate, FileUploader, Navbar, Gendialog, Attach, User, Config) {
	
	/*
	 * SCOPE
	 */
	
	$scope.attach = Attach;
	
	/*
	 * PUB FUNCS
	 */
	
	// create a uploader with options
	$scope.uploader = new FileUploader({
		scope: $scope,
		url: Config.base_url + 'webapp/upload/uploadfile/',
		formData: null,
		removeAfterUpload: true
	});

    $scope.uploader.onCompleteAll = function(){
        $scope.refreshAttachsList(Attach.currPatientId, Attach.currExamId);
    };

	$scope.uploader.onAfterAddingFile = function(fileItem) {
		var formdata = {
			patientid: Attach.currPatientId,
			examid: Attach.currExamId
		};
		fileItem.formData = [formdata];
	};

	$scope.uploader.onErrorItem = function(fileItem, response, status, headers) {
		Gendialog.openSimpleErrorDialog("ERRORE", "File " + fileItem.file.name + "<br />" + response.error);
	};

    /**
	 * Refresh attachs list
	 * 
	 */
	$scope.refreshAttachsList = function(patientid, examid) {
		//console.log('fetch attachs list');
		Attach.getAllAttachsList(patientid, examid, function(ack, msg, data) {
			//console.log(Attach);
			if (!ack) {
				Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), msg);
			}
		});
	};
	
	/**
	 * Open dialog to remove an attach
	 * 
	 */
	$scope.openDialogDeleteConfirm = function(fileid, filepath) {
		Gendialog.openConfirmDialog($translate('ATTACH.MSG.DELCONFIRM_TITLE'), $translate('ATTACH.MSG.DELCONFIRM_QUEST'), $scope.deleteAttach, [fileid, filepath]);
	};
	
	/**
	 * Delete attach from server
	 * 
	 */
	$scope.deleteAttach = function(fileid, filepath) {
		Attach.delAttach(fileid, filepath, function() {
			$scope.refreshAttachsList(Attach.currPatientId, Attach.currExamId);
		});
	};

}

