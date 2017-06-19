
(function (angular) {

  "use strict";

  const AppBuilder3 = angular.module("AppBuilder3");

  AppBuilder3.controller("FormController", FormController);

  FormController.$inject = ["$scope", "$timeout", "JsonSchema", "JSON_SCHEMA_SPEC_URL"];
  function FormController (  $scope,   $timeout,   JsonSchema,   JSON_SCHEMA_SPEC_URL) {

    $scope.schemaUrl = JSON_SCHEMA_SPEC_URL;
    $scope.schema = {};
    $scope.form = [
      "*",
      {
        type: "submit",
        title: "Save"
      }
    ];
    $scope.model = {};

    JsonSchema.load($scope.schemaUrl)
      .then(function (res) {
        console.log(res);
        $timeout(function () {
          $scope.schema = res;
          // Object.assign($scope.schema, res.data);
        });
      })
      .catch(err => {
        console.log(err);
      });

  }

})(angular);
