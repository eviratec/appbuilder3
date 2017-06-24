"use strict";

describe("Case #4: Spreadsheet", function () {

  const NUM_ROWS = 5;
  const NUM_COLS = 7

  let JsonSchema;
  let $compile;
  let $rootScope;

  let $scope;

  let tableCellIndex;
  let table;
  let schema;
  let models;

  beforeEach(module('AppBuilder3'));

  beforeEach(inject(function (_JsonSchema_, _$compile_, _$rootScope_) {

    JsonSchema = _JsonSchema_;
    $compile = _$compile_;
    $rootScope = _$rootScope_;

    $scope = $rootScope.$new(true);

    // Row schema
    schema = new JsonSchema({
      "$schema": "http://json-schema.org/draft-04/schema#",
      "description": "schema for a spreadsheet row",
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        }
      }
    });

    tableCellIndex = {};

    // Table data (row models)
    models = []; // rows

    for (let i = 1; i <= NUM_ROWS; i++) {
      models.push({ id: "row#" + i, "col#0": "meow" });
    }

    table = {
      cols: [
        idCol(),
      ],
    };

    // Create and add the column objects
    for (let c = 1; c <= NUM_COLS; c++) {
      let colId = "col#" + c;
      table.cols.push(col(colId, colId, function getCellValue (model, schema) {
        let r = model.id.split("#")[1];
        return tableCellIndex[r+"/"+c];
      }));
      // Table cells
      for (let r = 1; r <= NUM_ROWS; r++) {
        tableCellIndex[r+"/"+c] = r+"/"+c;
      }
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

  }));

  describe("Table Header", function () {

    it("Adds the appropriate column header cells", function () {

      let element;

      $scope.table = table;
      $scope.schema = schema;
      $scope.models = models;

      element = $compile("<div ab-table=\"table\" ab-schema=\"schema\" ab-models=\"models\"></div>")($scope);

      $scope.$digest();

      expect(element.html()).toContain("table-header");
      expect(element.html()).toContain("col#1");
      expect(element.html()).toContain("col#7");

    });

  });

  describe("Table Data", function () {

    it("Adds the appropriate content", function () {

      let element;

      $scope.table = table;
      $scope.schema = schema;
      $scope.models = models;

      element = $compile("<div ab-table=\"table\" ab-schema=\"schema\" ab-models=\"models\"></div>")($scope);

      $scope.$digest();

      expect(element.html()).toContain("5/7");

      expect(element.html()).toContain("row#5");
      expect(element.html()).toContain("row#5");

    });

    it("Adds the appropriate cell classes", function () {

      let className;
      let element;

      $scope.table = table;
      $scope.schema = schema;
      $scope.models = models;

      element = $compile("<div ab-table=\"table\" ab-schema=\"schema\" ab-models=\"models\"></div>")($scope);

      $scope.$digest();

      className = element.find("ab-table-cell")[0].className;

      expect(className).toContain("flex");
      expect(className).toContain("id-col");
      expect(className).toContain("table-cell");

    });

    it("Adds the correct number of cells", function () {

      let element;

      $scope.table = table;
      $scope.schema = schema;
      $scope.models = models;

      element = $compile("<div ab-table=\"table\" ab-schema=\"schema\" ab-models=\"models\"></div>")($scope);

      $scope.$digest();

      let cellCount = element.html().match(/\<ab\-table\-cell /g).length;

      expect(cellCount).toBe(40);

    });

  });

});
