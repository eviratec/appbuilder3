
(function (angular) {

  "use strict";

  const AppBuilder3 = angular.module("AppBuilder3");

  AppBuilder3.directive("abForm", abFormDirective);

  abFormDirective.$inject = ["$compile", "JsonSchema"];
  function abFormDirective (  $compile,   JsonSchema) {

    return {
      restrict: "A",
      link: link,
      scope: {
        abSchema: "=",
        abForm: "=",
        abModel: "=",
      },
      controller: "FormDirectiveController",
      transclude: true,
    };

    function link (scope, el, attrs, ctrl) {

      ctrl.schema = scope.abSchema;
      ctrl.form = scope.abForm;
      ctrl.model = scope.abModel;

      scope.$watch("abSchema", (newValue) => {
        if (undefined === newValue || !newValue.$schema) {
          return;
        }
        ctrl.schema = newValue;
        let schema = new JsonSchema(newValue);
        el[0].innerHTML = "";
        schema.forEachProp((key, value) => {
          console.log(value);
          let propEl = abFormField(key, value);
          $compile(el[0].appendChild(propEl))(scope);
        });
        console.log(schema);
      });

      function abFormField (key, value) {
        let el = document.createElement("ab-form-field");
        el.setAttribute("class", "prop-" + key);
        el.setAttribute("ab-prop-key", key);
        el.setAttribute("ab-prop-value", "abSchema.properties." + key);
        el.setAttribute("ab-model", "abModel." + key);
        el.setAttribute("layout", "");
        return el;
      }

    }

  }

})(angular);
