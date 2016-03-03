function annotationCtrl($scope, $translate, Navbar, Gendialog, Graphui, Annotation, User) {
	
	/*
	 * SCOPE
	 */
	
	$scope.annotations = Annotation;
	$scope.annotationviz = {
		create: false,
		write: false
	};
	$scope.annotationtypes = User.getDropdownList(User.getAllAnnotationsTypeData());
	
	/*
	 * PRIV FUNCS
	 */
	
	/**
	 * 
	 * 
	 */
	var callbackAfterUpdate = function(objid, objtype) {
		$scope.annotationviz.write = false;
		$scope.annotationviz.create = false;
		$scope.refreshAnnotationsList(objid, objtype);
		Annotation[objtype].obj = null;
	};
	
	/*
	 * PUB FUNCS
	 */
	
	/**
	 * Get annotation type name by code
	 * 
	 */
	$scope.getAnnotationTypeNameByCode = function(code) {
		var annobj = User.getAnnotationTypeData(code);
		if (annobj && annobj.text) {
			return annobj.text;
		} else {
			return null;
		}
	};
	
	/**
	 * Create a copy of server data
	 * 
	 */
	$scope.enableUpdateAnnotationDetails = function(objtype) {
		Annotation.backupAnnotation(objtype);
		$scope.annotationviz.write = true;
	};
	
	/**
	 * Reload the copy of server data
	 * 
	 */
	$scope.backAnnotationUpdate = function(anntype) {
		Annotation.revertBackupAnnotation(anntype);
		$scope.annotationviz.write = false;
		$scope.annotationviz.create = false;
	};
	
	/**
	 * Refresh annotations list
	 * 
	 */
	$scope.refreshAnnotationsList = function(objid, objtype) {
		Annotation.getAllAnnotations(objid, objtype, function(ack, msg, payload) {
			//Graphui.setLoading(false);
		});
	};
	
	/**
	 * Select annotation
	 * 
	 */
	$scope.selectAnnotation = function(objtype, annobj) {
		$scope.annotationviz.write = false;
		$scope.annotationviz.create = false;
		Annotation[objtype].obj = annobj;
	};
	
	/**
	 * Create or update annotation
	 * 
	 */
	$scope.updateAnnotationDetails = function(objid, objtype) {
		if ($scope.editAnnotationForm.$valid) {
			if (Annotation[objtype].obj && Annotation[objtype].obj.id) {
				Annotation.updateAnnotationDetails(Annotation[objtype].obj.id, objtype, function(ack, msg, payload) {
					if (ack) {
						callbackAfterUpdate(objid, objtype);
					} else {
						Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), msg);
					}
				});
			} else {
				Annotation.createAnnotationDetails(objid, objtype, function(ack, msg, payload) {
					if (ack) {
						callbackAfterUpdate(objid, objtype);
					} else {
						Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), msg);
					}
				});
			}
		} else {
			Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), $translate('ANNOTATION.ERR.EMPTY'));
		}
	};
	
	/**
	 * Enable creation of new annotation
	 * 
	 */
	$scope.openCreateNewAnnotation = function(type) {
		Annotation[type].obj = null;
		$scope.annotationviz.write = true;
		$scope.annotationviz.create = true;
	};
	
	/**
	 * Delete annotation dialog
	 * 
	 */
	$scope.openAnnotationDialogDeleteConfirm = function(objid, objtype) {
		var dialogtitle = $translate('ANNOTATION.MSG.DELCONFIRM_TITLE');
		var dialogmsg = $translate('ANNOTATION.MSG.DELCONFIRM_QUEST');
		Gendialog.openConfirmDialog(dialogtitle, dialogmsg, function() {
			$scope.deleteAnnotation(objid, objtype);
		});
	};
	
	/**
	 * Delete annotation
	 * 
	 */
	$scope.deleteAnnotation = function(objid, objtype) {
		Annotation.deleteAnnotation(Annotation[objtype].obj.id, function(ack, msg, payload) {
			callbackAfterUpdate(objid, objtype);
		});
	};
	
	/**
	 * Print annotation
	 * 
	 */
	$scope.printAnnotationDetails = function(id) {
		Annotation.printAnnotationDetails(id);
	};
	
};
