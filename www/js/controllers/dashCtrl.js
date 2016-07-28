angular.module('starter.controllers')
  .controller('DashCtrl', function($scope, $state, $localStorage, $http) {
    var PROXIMIIO_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImlzcyI6IjM3NGRmMTBhODI3NDQ2MTdiZDU3MzE5OTg2MjFlMjA3IiwidHlwZSI6ImFwcGxpY2F0aW9uIiwiYXBwbGljYXRpb25faWQiOiI5MjQ5ZTQ4ZC1lOWU4LTQ2OTctODUwYi1mMTZhNzQzOGMxYTkifQ.MfY5GpYWMyIxCGs05npiufTQj-w3stJEXxzjUzW28Ug";
    var GADI_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImlzcyI6IjM4Mjc1N2E1YmY4ZTQ3OTBhMGEwZmY0ZmUyYzJjNTdmIiwidHlwZSI6ImFwcGxpY2F0aW9uIiwiYXBwbGljYXRpb25faWQiOiIxYjU4OGU5Ni02ZTA2LTRhZjYtODdlNC0yZDc1MDM4NDFkNTEifQ.CssLoRApAOCNb4rS922sjfwkbktYNJ79PK9H321o5qQ";

    // init geofences
    $scope.listCanSwipe = true;
    if ($localStorage.geofences === undefined) {
      $localStorage.geofences = [];
    } else {
      $scope.geofences = $localStorage.geofences;
    }

    $scope.delete = function(fence) {
      for (var i = 0; i < $localStorage.geofences.length; i++) {
        if ($localStorage.geofences[i].data.id === fence.data.id) {
          $localStorage.geofences[i].circle.remove();
          $localStorage.geofences[i].marker.remove();
          $localStorage.geofences.splice(i, 1);
        }
      }
      $scope.geofences = $localStorage.geofences;

      // remove from server
      var req = {
        method: 'DELETE',
        url: 'https://api.proximi.fi/core/geofences/' + fence.data.id,
        headers: {
          'Authorization': 'Bearer ' + GADI_TOKEN
        }
      }

      $http(req)
        .then(function(data) {
          console.log(data.data.name + 'deleted');
        })
        .catch(function(err) {
          console.log(err);
          alert(err);
        });
    }
  });
