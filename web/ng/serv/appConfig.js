var appConfig = angular.module('appConfig', []);

appConfig.factory('Config', function() {
	var config = {};
	config.base_url = 'http://localhost:8080/docup';
	return config;
});


