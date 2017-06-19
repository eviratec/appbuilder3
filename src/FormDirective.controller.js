
(function (angular) {

  "use strict";

  const AppBuilder3 = angular.module("AppBuilder3");

  AppBuilder3.controller("FormDirectiveController", FormDirectiveController);

  FormDirectiveController.$inject = ["$scope"];
  function FormDirectiveController (  $scope) {
    $scope.foo = "bars";
  }

})(angular);
