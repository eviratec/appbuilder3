/**
 * AppBuilder3
 * Copyright (c) 2017 Callan Peter Milne
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

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

      el.addClass("flat-form");

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
