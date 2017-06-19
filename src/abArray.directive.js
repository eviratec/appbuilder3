
(function (angular) {

  "use strict";

  const AppBuilder3 = angular.module("AppBuilder3");

  AppBuilder3.directive("abArray", abArrayDirective);

  abArrayDirective.$inject = ["$compile", "JsonSchema"];
  function abArrayDirective (  $compile,   JsonSchema) {

    return {
      restrict: "E",
      require: ["^^abFormField"],
      link: link,
      controller: "ArrayDirectiveController",
    };

    function link (scope, el, attrs, ctrl) {
      let formEl;
      let arrEl = document.createElement("div");
      arrEl.innerHTML = scope.abPropKey;
      el[0].appendChild(arrEl);
      scope.form = [
        "*",
        {
          type: "submit",
          title: "Save"
        }
      ];
      scope.model = {};
      scope.$watch("abPropValue.items", (newValue) => {
        console.log("***********************");
        console.log(newValue);
      })
      formEl = document.createElement("form");
      formEl.setAttribute("ab-schema", "abPropValue.items");
      formEl.setAttribute("ab-form", "form");
      formEl.setAttribute("ab-model", "model");
      formEl.setAttribute("layout", "column");
      $compile(el[0].appendChild(formEl))(scope);
    }

  }

})(angular);
