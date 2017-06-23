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

  AppBuilder3.controller("SpreadsheetController", SpreadsheetController);

  SpreadsheetController.$inject = ["$scope", "$timeout", "JsonSchema", "JSON_SCHEMA_SPEC_URL"];
  function SpreadsheetController (  $scope,   $timeout,   JsonSchema,   JSON_SCHEMA_SPEC_URL) {

    $scope.schema = new JsonSchema({
      "$schema": "http://json-schema.org/draft-04/schema#",
      "description": "schema for a spreadsheet row",
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        }
      }
    });

    $scope.rows = [];

    let tableCell = {};

    //rows
    for (let i = 1; i <= 20; i++) {
      $scope.rows.push({ id: "row#" + i, "col#0": "meow" });
    }

    $scope.table = {
      cols: [
        idCol(),
      ],
    };

    //cols
    for (let c = 1; c <= 50; c++) {
      let colId = "col#" + c;
      $scope.table.cols.push(col(colId, colId, function getCellValue (model, schema) {
        let r = model.id.split("#")[1];
        return tableCell[r+"/"+c];
      }));
      //cells
      for (let r = 1; r <= 20; r++) {
        tableCell[r+"/"+c] = r+"/"+c;
      }
    }

    setTimeout(function () {
      exportTableData();
    }, 1000);

    function exportTableData () {
      let x = {
        cols: [],
        data: {},
      };
      $scope.table.cols.forEach(col => {
        x.cols.push(col);
        $scope.rows.forEach(row => {
          x.data[col.property+"/"+row.id] = col.cells.value(row, $scope.schema);
        });
      });
      console.log(JSON.stringify(x, undefined, "  "));
    }

    function idCol () {
      return col("id", "", function getCellValue (model, schema) {
        return model.id;
      });
    }

    function col (property, label, getValueFn) {
      return {
        "property": property,
        "headers": {
          "label": label,
        },
        "cells": {
          "value": getValueFn,
          "onClick": function ($event, model, schema) {
            let key = property;
            let value = getValueFn(model, schema);
          },
        },
      };
    }

  }

})(angular);
