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
