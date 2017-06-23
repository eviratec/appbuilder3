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

  AppBuilder3.directive("abTableCell", abTableCellDirective);

  abTableCellDirective.$inject = ["$compile", "JsonSchema"];
  function abTableCellDirective (  $compile,   JsonSchema) {

    return {
      restrict: "E",
      link: link,
      scope: {
        abSchema: "=",
        abCol: "=",
        abModel: "=",
      },
      controller: "TableCellDirectiveController",
    };

    function link (scope, el, attrs, ctrl) {

      let col = scope.abCol;
      el.addClass(col.property + "-col table-cell");

      let cellValueEl = document.createElement("div");
      cellValueEl.setAttribute("class", "ab-table-cell cell-value");
      cellValueEl.setAttribute("contenteditable", "");
      cellValueEl.innerHTML = col.cells.value(scope.abModel, scope.abSchema);

      scope.$watch("abModel", function (newValue, oldValue) {

      });

      el[0].appendChild(cellValueEl);


    }

  }

})(angular);
