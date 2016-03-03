function docsignCtrl($scope, $location, $modal, $translate, $sce, Navbar, Gendialog, Service, User, Docsign) {
	
	/*
	 * SCOPE
	 */
	
	$scope.navbar = Navbar;
	$scope.docsign = Docsign;
	$scope.user = User;
	$scope.avasigndocviz = {
		create: false,
		write: false
	};
	$scope.signdocviz = {
		write: false
	};
	
	/*
	 * PRIV FUNCS
	 */
	var callbackAvailableServiceUpdated = function(ack, msg, payload) {
		if (!ack) {
			Gendialog.openSimpleErrorDialog($translate('GENERAL.ERR.ERROR'), msg);
		}
		$scope.avaserviceviz.write = false;
		$scope.avaserviceviz.create = false;
	};
	
	/*
	 * AVAILABLE SERVICES
	 */
	
	/**
	 * Get docsign file from server
	 * 
	 */
	$scope.getDocsignFromServer = function(type, filename) {
		Docsign.getFlexSchemaFromServer(type, filename, function(e) {
			
		});
	};
	
	/**
	 * Get docsign file from server
	 * 
	 */
	$scope.getUnsafeHtml = function(html) {
		return $sce.trustAsHtml(html);
	};
	
	/**
	 * Print docsign
	 * 
	 */
	$scope.printDocsign = function(type) {
		var formarr = $('#form1').serializeArray();
		Docsign.printDocsign(Docsign[type].docName, formarr);
	};
	
	
	
};

