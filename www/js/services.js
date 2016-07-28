var PROXIMIIO_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImlzcyI6IjM3NGRmMTBhODI3NDQ2MTdiZDU3MzE5OTg2MjFlMjA3IiwidHlwZSI6ImFwcGxpY2F0aW9uIiwiYXBwbGljYXRpb25faWQiOiI5MjQ5ZTQ4ZC1lOWU4LTQ2OTctODUwYi1mMTZhNzQzOGMxYTkifQ.MfY5GpYWMyIxCGs05npiufTQj-w3stJEXxzjUzW28Ug";

angular.module('starter.services', [])
  .factory("Proximiio", function() {
    return {
      init: function(outputTriggerCallback, inputTriggerCallback, positionChangeCallback) {
        proximiio.setToken(PROXIMIIO_TOKEN);
        proximiio.setDebugOutput(true, null, null);
        proximiio.setOutputTriggerCallback(outputTriggerCallback);
        proximiio.setInputTriggerCallback(inputTriggerCallback);
        proximiio.setPositionChangeCallback(positionChangeCallback);
      }
    };
});
