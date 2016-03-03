var appUI = angular.module('appUI', []);

appUI.factory('Graphui', ['$location',
	function($location) {
	
	var graphui = {
		viz: {
			loading: true
		}
	};
	
	/**
	 * Set loading true or false
	 * 
	 */
	graphui.setLoading = function(state) {
		graphui.viz.loading = state;
	};
	
	/**
	 * Get loading state
	 * 
	 */
	graphui.getLoading = function() {
		return graphui.viz.loading;
	};
	
	return graphui;
}]);