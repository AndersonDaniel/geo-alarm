angular.module('starter.controllers')
.controller('MapsCtrl', function($scope, $ionicLoading, $compile, Proximiio, $http, $localStorage) {
  var map;
  var PROXIMIIO_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImlzcyI6IjM3NGRmMTBhODI3NDQ2MTdiZDU3MzE5OTg2MjFlMjA3IiwidHlwZSI6ImFwcGxpY2F0aW9uIiwiYXBwbGljYXRpb25faWQiOiI5MjQ5ZTQ4ZC1lOWU4LTQ2OTctODUwYi1mMTZhNzQzOGMxYTkifQ.MfY5GpYWMyIxCGs05npiufTQj-w3stJEXxzjUzW28Ug";
  
  if ($localStorage.geofences === undefined) {
    $localStorage.geofences = [];
  }

  $scope.alarm = {};
  
  $scope.$watch('alarm.alarmRadius', function(newval, oldval) {
	  console.log(newval);
	  if ($scope.currCircle) {
		  $scope.currCircle.setRadius(newval);
	  }
  });
  
  document.addEventListener("deviceready", function() {
    var div = document.getElementById("map");

    // Initialize the map view
    map = plugin.google.maps.Map.getMap(div);

    // Wait until the map is ready status.
    map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);
	
	map.on(plugin.google.maps.event.MAP_CLICK, function(latLng) {
		if ($scope.addingFence && !$scope.latLng) {
			$scope.latLng = latLng;
			var latlng = new plugin.google.maps.LatLng(latLng.lat, latLng.lng);
			map.addCircle({
				'center': latlng,
				'radius': $scope.alarm.alarmRadius,
				'strokeColor': '#AA00FF',
				'strokeWidth': 2,
				'fillColor': '#880000'
			}, function(circle) {
				$scope.currCircle = circle;
			});
			$scope.$apply();
		}
	});
	
  }, false);

  $scope.whattheF = function() {
	return $scope.addingFence && !$scope.latlng;
  }
  
  $scope.myLoc = function() {
    if ($scope.loc !== undefined) {
      map.animateCamera({
        'target': $scope.loc,
        'zoom': 18,
        'duration': 1000 // = 5 sec.
      }, function() {
        console.log("The animation is done");
      });
    }
  }

  $scope.doneAddingFence = function() {
	  $scope.addGeoFence($scope.latLng.lat, $scope.latLng.lng, "GeoAlarm", $scope.alarm.alarmMessage, $scope.alarm.alarmRadius);
	  $scope.toggleAddFence();
  }
  
  $scope.addGeoFence = function(lat, lng, name, message, radius) {
    var req = {
      method: 'POST',
      url: 'https://api.proximi.fi/core/geofences',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + PROXIMIIO_TOKEN
      },
      data: {
        name: name,
        address: ' ',
        area: {
          lat: lat,
          lng: lng
        },
        raduis: radius
      }
    }

    $http(req)
      .then(function(data) {
        data.data.checked = true;
		data.data.message = message;
        $localStorage.geofences.push(data);
		drawFence(data);
        console.log($localStorage.geofences.length);
      })
      .catch(function(err) {
        console.log(err);
		alert(err);
      });
  }
  

  $scope.toggleAddFence = function() {
	$scope.addingFence = !$scope.addingFence;
	if (!$scope.addingFence) {
		$scope.latLng = undefined;
		$scope.alarm.alarmMessage = undefined;
		$scope.alarm.alarmRadius = undefined;
		if ($scope.currCircle) {
			$scope.currCircle.remove();
			$scope.currCircle = undefined;
		}
	} else {
		$scope.alarm.alarmRadius = 100;
		$scope.alarm.alarmMessage = "Wake up"
	}
  }
  
  $scope.kaboom = function() {
    var req = {
      method: 'POST',
      url: 'https://api.proximi.fi/core/geofences',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + PROXIMIIO_TOKEN
      },
      data: {
        name: 'test2',
        address: 'gadi2',
        area: {
          lat: '32.053224',
          lng: '34.3203677'
        },
        raduis: '700'
      }
    }

    $http(req)
      .then(function(data) {
        data.data.checked = true;
        $localStorage.geofences.push(data);
        console.log($localStorage.geofences.length);
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  function drawFence(fence) {
	  var latlng = new plugin.google.maps.LatLng(fence.data.geopoint[1], fence.data.geopoint[0]);
	  map.addCircle({
		'center': latlng,
		'radius': fence.data.raduis,
		'strokeColor': '#AA00FF',
		'strokeWidth': 2,
		'fillColor': '#880000'
	  });

	  map.addMarker({
		'position': latlng,
		'title': fence.data.name,
	  }, function(marker) {
		marker.showInfoWindow();
	  });
  }
  
  function onMapReady() {

    // draw fences
    (function() {
      if ($localStorage.geofences !== undefined) {
        $localStorage.geofences.forEach(drawFence);
      }
    })();

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

      $scope.loc = new plugin.google.maps.LatLng($scope.lastPositionLatitude, $scope.lastPositionLongitude);

      var msg = ["Current your location:\n",
        "latitude:" + $scope.loc.lat,
        "longitude:" + $scope.loc.lng
      ].join("\n");

      if ($scope.mark === undefined) {
        map.addMarker({
          'position': $scope.loc,
          'title': msg,
          'icon': {
            url: './img/my-loc.png'
          }
        }, function(marker) {
          marker.showInfoWindow();
          $scope.mark = marker;
        });
      } else {
        $scope.mark.setPosition($scope.loc);
        var msg = ["latitude:" + $scope.loc.lat,
          "longitude:" + $scope.loc.lng
        ].join("\n");
        $scope.mark.setTitle(msg);
      }

      $scope.$apply();
    };

    Proximiio.init(outputTriggerCallback, inputTriggerCallback, positionChangeCallback);
  };
})
