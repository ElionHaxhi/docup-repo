var appGendialog = angular.module('appGendialog', []);

appGendialog.factory('Gendialog', function(Config, $modal) {
	
	var gendialog = {};
	
	gendialog.openConfirmDialog = function(title, msg, confirmCallback, callbackParams) {
		//var t = '<div class="modal" tabindex="-1" role="dialog"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header" ng-show="title"> <button type="button" class="close" ng-click="$hide()">&times;</button> <h4 class="modal-title" ng-bind-html="title"></h4> </div> <div class="modal-body" ng-show="content"> <h4>Text in a modal</h4> <p ng-bind-html="content"></p> <pre>2 + 3 = {{ 2 + 3 }}</pre> <h4>Popover in a modal</h4> <p>This <a href="#" role="button" class="btn btn-default popover-test" data-title="A Title" data-content="And heres some amazing content. Its very engaging. right?" bs-popover>button</a> should trigger a popover on click.</p> <h4>Tooltips in a modal</h4> <p><a href="#" class="tooltip-test" data-title="Tooltip" bs-tooltip>This link</a> and <a href="#" class="tooltip-test" data-title="Tooltip" bs-tooltip>that link</a> should have tooltips on hover.</p> </div> <div class="modal-footer"> <button type="button" class="btn btn-default" ng-click="$hide()">Close</button> <button type="button" class="btn btn-primary" ng-click="$hide()">Save changes</button> </div> </div> </div> </div>';
		var t = '<div class="modal-header">'+
          '<h3>' + title + '</h3>'+
          '</div>'+
          '<div class="modal-body">'+
          msg +
          '</div>'+
          '<div class="modal-footer">'+
          '<button ng-click="close()" class="btn btn-default"><span class="glyphicon glyphicon-remove"></span></button>'+
          '<button ng-click="confirm()" class="btn btn-danger"><span class="glyphicon glyphicon-ok"></span></i></button>'+
          '</div>';
		function modalInstanceCtrl($scope, $modalInstance, confirmCallback, callbackParams) {
			$scope.close = function(){
				$modalInstance.close();
			};
			
			$scope.confirm = function(){
				$modalInstance.close();
				confirmCallback.apply(null, callbackParams);
			};
		}
		
	    var modalInstance = $modal.open({
			template: t,
	  		controller: modalInstanceCtrl,
	  		resolve: {
				confirmCallback: function () {
					return confirmCallback;
				},
				callbackParams: function () {
					return callbackParams;
				}
			}
		});
	};
	
	gendialog.openSimpleErrorDialog = function(title, msg) {
		var t = '<div class="modal-header">'+
          '<h3>' + title + '</h3>'+
          '</div>'+
          '<div class="modal-body">'+
          msg +
          '</div>'+
          '<div class="modal-footer">'+
          '<button ng-click="close()" class="btn btn-danger"><span class="glyphicon glyphicon-remove"></i></button>'+
          '</div>';
		function modalInstanceCtrl($scope, $modalInstance){
			$scope.close = function(){
				$modalInstance.close();
			};
		}
		
        var modalInstance = $modal.open({
			template: t,
      		controller: modalInstanceCtrl
		});
	};
	
	return gendialog;
});

