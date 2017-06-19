
(function (angular) {

  "use strict";

  const AppBuilder3 = angular.module("AppBuilder3");

  AppBuilder3.directive("abObject", abObjectDirective);

  abObjectDirective.$inject = ["$compile", "JsonSchema"];
  function abObjectDirective (  $compile,   JsonSchema) {

    return {
      restrict: "E",
      require: ["^^abFormField"],
      link: link,
      controller: "ObjectDirectiveController",
    };

    function link (scope, el, attrs, ctrl) {
      let formEl;
      let arrEl = document.createElement("div");
      arrEl.innerHTML = scope.abPropKey;
      el[0].appendChild(arrEl);
      scope.form = [
        "*",
      ];
      scope.model = {};
      scope.$watch("abPropValue", (newValue) => {
        console.log("##########################*******");
        console.log(newValue);
      })
      formEl = document.createElement("div");
      formEl.setAttribute("ab-schema", "abPropValue");
      formEl.setAttribute("ab-form", "form");
      formEl.setAttribute("ab-model", "model");
      formEl.setAttribute("layout", "column");
      $compile(el[0].appendChild(formEl))(scope);
    }

  }

})(angular);
