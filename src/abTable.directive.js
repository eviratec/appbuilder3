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
        abModel: "=",
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
      ctrl.form = scope.abForm;
      ctrl.model = scope.abModel;

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

      scope.$watchCollection("abModel", (newModels) => {

        if (!newModels.length) {
          return;
        }
        console.log(newModels,"****NEW MODELS",cols);

        newModels.forEach(newModel => {
          let modelRowEl = document.createElement("div");
          let schema = scope.abSchema;
          modelRowEl.setAttribute("class", "table-row model");
          modelRowEl.setAttribute("layout", "row");
          cols.forEach(col => {
            let cellEl = document.createElement("ab-table-cell");
            let newScope = $rootScope.$new(true, scope);
            newScope.abSchema = schema;
            newScope.abCol = col;
            newScope.abModel = newModel;
            newScope.onClick = function ($event) {
              console.log("clicked on cell", $event);
              let onClick = col.cells.onClick;
              onClick && onClick($event, newModel, schema);
            };
            cellEl.setAttribute("class", "table-cell value");
            cellEl.setAttribute("flex", "");
            cellEl.setAttribute("ab-schema", "abSchema");
            cellEl.setAttribute("ab-col", "abCol");
            cellEl.setAttribute("ab-model", "abModel");
            // cellEl.setAttribute("ab-model", "abModel");
            cellEl.setAttribute("ng-click", "onClick($event)");
            cellEl.innerHTML = col.cells.value(newModel, schema);
            $compile(modelRowEl.appendChild(cellEl))(newScope);
          });
          $compile(rowContainerEl.appendChild(modelRowEl))(scope);
        });

      });

    }

  }

})(angular);
