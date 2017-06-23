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

    for (let i = 0; i < 50; i++) {
      $scope.rows.push({ id: "row#" + i, textt: "meow" });
    }

    $scope.table = {
      cols: [
        idCol(),
        texttCol(),
      ],
    };

    function idCol () {
      return col("id", "id", function getCellValue (model, schema) {
        return model.id;
      });
    }

    function texttCol () {
      return col("textt", "Textt", function getCellValue (model, schema) {
        return model.textt;
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
