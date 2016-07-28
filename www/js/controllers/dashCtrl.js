angular.module('starter.controllers')
.controller('DashCtrl', function($scope, $state, $localStorage) {
	// init geofences
	if ($localStorage.geofences === undefined) {
		$localStorage.geofences = [];
	}
	else {
		$scope.geofences = $localStorage.geofences;
	}
});
