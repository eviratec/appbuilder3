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

  AppBuilder3.directive("abTable", abTableDirective);

  abTableDirective.$inject = ["$rootScope", "$compile", "JsonSchema"];
  function abTableDirective (  $rootScope,   $compile,   JsonSchema) {

    return {
      restrict: "A",
      link: link,
      scope: {
        abSchema: "=",
        abTable: "=",
        abModels: "=",
      },
      controller: "TableDirectiveController",
      transclude: true,
    };

    function link (scope, el, attrs, ctrl) {

      let cols = [];

      let topRowEl = document.createElement("div");
      topRowEl.setAttribute("class", "table-header");
      topRowEl.setAttribute("layout", "row");

      $compile(el[0].appendChild(topRowEl))(scope);

      let rowContainerEl = document.createElement("div");
      rowContainerEl.setAttribute("class", "table-data table-row-container");
      rowContainerEl.setAttribute("layout", "column");

      $compile(el[0].appendChild(rowContainerEl))(scope);

      let bottomRowEl = document.createElement("div");
      bottomRowEl.setAttribute("class", "table-footer");
      bottomRowEl.setAttribute("layout", "row");

      $compile(el[0].appendChild(bottomRowEl))(scope);

      ctrl.schema = scope.abSchema;
      ctrl.table = scope.abTable;
      ctrl.models = scope.abModels;

      scope.$watchCollection("abTable.cols", (newCols) => {

        if (!newCols.length) {
          return;
        }

        newCols.forEach(newCol => {
          let colHeaderEl = document.createElement("div");
          let colFooterEl = document.createElement("div");
          let propKey = newCol.property;
          let label = newCol.headers.label;
          colHeaderEl.setAttribute("class", "col-header " + propKey + "-col");
          colHeaderEl.setAttribute("flex", "");
          colHeaderEl.innerHTML = label;
          $compile(topRowEl.appendChild(colHeaderEl))(scope);
          colFooterEl.setAttribute("class", "col-footer " + propKey + "-col");
          colFooterEl.setAttribute("flex", "");
          colFooterEl.innerHTML = "<md-input-container><input placeholder=\"" + label + "\" /></md-input-container>";
          $compile(bottomRowEl.appendChild(colFooterEl))(scope);
          cols.push(newCol);
        });

      });

      scope.$watchCollection("abModels", (newModels) => {

        if (!newModels || !newModels.length) {
          return;
        }

        if ("string" === typeof newModels) {
          newModels = JSON.parse(newModels);
        }

        newModels.forEach(newModel => {

          let modelRowEl = document.createElement("div");
          let schema = scope.abSchema;
          let rowScope = $rootScope.$new(true, scope);

          modelRowEl.setAttribute("class", "table-row model");
          modelRowEl.setAttribute("layout", "row");

          $compile(rowContainerEl.appendChild(modelRowEl))(rowScope);

          cols.forEach(col => {

            let cellEl = document.createElement("ab-table-cell");
            let cellScope = $rootScope.$new(true, rowScope);

            cellScope.abSchema = schema;
            cellScope.abCol = col;
            cellScope.abModel = newModel;

            cellEl.setAttribute("flex", "");
            cellEl.setAttribute("ab-schema", "abSchema");
            cellEl.setAttribute("ab-col", "abCol");
            cellEl.setAttribute("ab-model", "abModel");
            cellEl.setAttribute("ng-click", "onClick($event)");

            $compile(modelRowEl.appendChild(cellEl))(cellScope);

          });

        });

      });

    }

  }

})(angular);
