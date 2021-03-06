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

  AppBuilder3.directive("abFormField", abFormFieldDirective);

  abFormFieldDirective.$inject = ["$compile", "JsonSchema"];
  function abFormFieldDirective (  $compile,   JsonSchema) {

    return {
      restrict: "E",
      link: link,
      scope: {
        abPropKey: "@",
        abPropValue: "=",
        abModel: "=",
      },
      controller: "FormFieldDirectiveController",
    };

    function link (scope, el, attrs, ctrl) {

      // console.log(scope,el,attrs,ctrl);
      console.log(scope.abPropKey, scope.abPropValue);
      console.log(ctrl);

      let n = inputEl(scope.abPropKey, scope.abPropValue);
      n.setAttribute("flex", "");
      $compile(el[0].appendChild(n))(scope);

      scope.$watch("abPropValue", (newValue) => {
        console.log(newValue);
      });

      function materialInputWrapper (key, value) {
        let div = document.createElement("md-input-container");
        div.setAttribute("class", "prop-" + key);
        div.appendChild(labelEl(key));
        div.appendChild(stringInputEl(key, value));
        return div;
      }

      function labelEl (key) {
        let label = document.createElement("label");
        label.innerHTML = key;
        return label;
      }

      function inputEl (key, value) {
        switch (value.type) {
          case "number":
            return numberInputEl(key, value);
          case "array":
            return arrayMgmtEl(key, value);
          case "object":
            return objectMgmtEl(key, value);
          case "boolean":
            return checkboxEl(key, value);
          default:
            // no break
          case "string":
            return materialInputWrapper(key, value);
        }
      }

      function numberInputEl (key, value) {
        let div = document.createElement("md-input-container");
        div.setAttribute("class", "prop-" + key);
        let inputEl = document.createElement("input");
        inputEl.setAttribute("ng-model", "abModel");
        inputEl.setAttribute("type", "number");
        div.appendChild(labelEl(key));
        div.appendChild(inputEl);
        return div;
      }

      function stringInputEl (key, value)  {
        switch (value.format) {
          case "date-time":
            return dateStringInputEl(key, value);
          case "text":
            // no break
          case "email":
            // no break
          case "password":
            // no break
          default:
            return textStringInputEl(key, value);
        }
      }

      function dateStringInputEl (key, value)  {
        let input = document.createElement("md-datepicker");
        input.setAttribute("ng-model", "abModel");
        return input;
      }

      function textStringInputEl (key, value)  {
        let input = document.createElement("input");
        input.setAttribute("ng-model", "abModel");
        return input;
      }

      function checkboxEl (key, value)  {
        let checkbox = document.createElement("md-checkbox");
        checkbox.setAttribute("ng-model", "abModel");
        checkbox.appendChild(labelEl(key));
        return checkbox;
      }

      function objectMgmtEl (key, value) {
        let objectMgmt = document.createElement("ab-object");
        return objectMgmt;
      }

      function arrayMgmtEl (key, value) {
        let arrayMgmt = document.createElement("ab-array");
        arrayMgmt.setAttribute("ab-schema", "abPropValue.items");
        arrayMgmt.setAttribute("ab-model", "abModel");
        return arrayMgmt;
      }

    }

  }

})(angular);
