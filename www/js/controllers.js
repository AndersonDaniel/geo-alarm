angular.module('starter.controllers', ['starter.services'])

.controller('DashCtrl', function($scope, $state, Proximiio) {
  $scope.entered = "Discovering...";
  $scope.output = "Waiting...";
  $scope.inputType = "Discovering...";
  $scope.inputObject = "Discovering...";
  $scope.lastPositionLatitude = "Discovering...";
  $scope.lastPositionLongitude = "Discovering...";

  ionic.Platform.ready(function() {

    var outputTriggerCallback = function(output) {
      $scope.output = output;
      $scope.$apply()
    };

    var inputTriggerCallback = function(entered, geofence) {
      $scope.entered = entered;
      $scope.inputType = geofence.name;
      $scope.lastPositionLatitude = geofence.area.lat;
      $scope.lastPositionLongitude = geofence.area.lon;
      $scope.inputObject = JSON.stringify(geofence, null, 2);
      $scope.$apply();
    };

    var positionChangeCallback = function(coords) {
      $scope.lastPositionLatitude = coords.coordinates.lat;
      $scope.lastPositionLongitude = coords.coordinates.lon;
      $scope.$apply();
    };

    Proximiio.init(outputTriggerCallback, inputTriggerCallback, positionChangeCallback);
  });

})

/*.controller('MapsCtrl', function($scope, $ionicLoading, $compile) {
		function initialize() {
			var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
			
			var mapOptions = {
			  center: myLatlng,
			  zoom: 16,
			  mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			var map = new google.maps.Map(document.getElementById("map"),
				mapOptions);
			
			//Marker + infowindow + angularjs compiled ng-click
			var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
			var compiled = $compile(contentString)($scope);

			var infowindow = new google.maps.InfoWindow({
			  content: compiled[0]
			});

			var marker = new google.maps.Marker({
			  position: myLatlng,
			  map: map,
			  title: 'Uluru (Ayers Rock)'
			});

			google.maps.event.addListener(marker, 'click', function() {
			  infowindow.open(map,marker);
			});

			$scope.map = map;
		  }
      //google.maps.event.addDomListener(window, 'load', initialize);
	  //initialize();
	  ionic.Platform.ready(initialize);
      
      $scope.centerOnMe = function() {
        if(!$scope.map) {
          return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.loading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
      };
      
      $scope.clickTest = function() {
        alert('Example of infowindow with ng-click');
	  }
	  
	  $scope.kaboom = function() {
		  alert('BOOM!');
	  };
})*/
.controller('MapsCtrl', function($scope, $ionicLoading, $compile) {
	var map;
    document.addEventListener("deviceready", function() {
      var div = document.getElementById("map");

      // Initialize the map view
      map = plugin.google.maps.Map.getMap(div);

      // Wait until the map is ready status.
      map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);
    }, false);

    function onMapReady() {
      var button = document.getElementById("button");
      button.addEventListener("click", onBtnClicked, false);
    }

    function onBtnClicked() {
      map.showDialog();
    }
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
