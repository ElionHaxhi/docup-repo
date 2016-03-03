function loadingStartCtrl($scope, $location, $translate, App, LoginAuthentication, Graphui, Flexschema, Agenda, Gendialog) {

	$scope.graphui = Graphui;
	Graphui.setLoading(true);
	
	//$location.path('/login/');
	

}

