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

  AppBuilder3.controller("FormController", FormController);

  FormController.$inject = ["$scope", "$timeout", "JsonSchema", "JSON_SCHEMA_SPEC_URL"];
  function FormController (  $scope,   $timeout,   JsonSchema,   JSON_SCHEMA_SPEC_URL) {

    $scope.schemaUrl = JSON_SCHEMA_SPEC_URL;
    $scope.schema = {};
    $scope.form = [
      "*",
      {
        type: "submit",
        title: "Save",
      },
    ];
    $scope.abModel = {};

    $scope.subModel = {};

    $scope.productPriceSchema = new JsonSchema({
      "id": "https://raw.githubusercontent.com/eviratec/schema/master/v1/product/price.json#",
      "$schema": "http://json-schema.org/draft-04/schema#",
      "description": "schema for a product price",
      "type": "object",
      "additionalProperties": false,
      "required": [ "id", "type", "amount", "is_public", "date_from", "date_thru" ],
      "properties": {
        "id": {
          "type": "string",
          "format": "uuid"
        },
        "type": {
          "type": "string",
          "maxLength": 18,
        },
        "amount": {
          "id": "https://raw.githubusercontent.com/eviratec/schema/master/v1/currency/amount.json#",
          "$schema": "http://json-schema.org/draft-04/schema#",
          "description": "schema for a currency amount",
          "type": "object",
          "required": [ "currency", "units" ],
          "properties": {
            "currency": {
              "id": "https://raw.githubusercontent.com/eviratec/schema/master/v1/currency.json#",
              "$schema": "http://json-schema.org/draft-04/schema#",
              "description": "schema for a currency",
              "type": "object",
              "additionalProperties": false,
              "required": [ "id", "code", "label", "separator" ],
              "properties": {
                "id": {
                  "type": "string",
                  "format": "uuid"
                },
                "code": {
                  "type": "string",
                  "maxLength": 4
                },
                "label": {
                  "type": "string",
                  "maxLength": 64
                },
                "prefix": {
                  "type": "string",
                  "maxLength": 1
                },
                "separator": {
                  "type": "object",
                  "required": [ "thousands", "decimal" ],
                  "properties": {
                    "thousands": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 1
                    },
                    "decimal": {
                      "type": "string",
                      "minLength": 1,
                      "maxLength": 1
                    }
                  }
                }
              }
            },
            "units": {
              "type": "number",
              "minimum": 0
            }
          }
        },
        "is_public": {
          "type": "boolean",
          "value": false
        },
        "date_from": {
          "type": "string",
          "format": "date-time"
        },
        "date_thru": {
          "type": "string",
          "format": "date-time"
        }
      }
    });

    $scope.prices = [{
      "amount": {
        "currency": { "code": "AUD" },
        "units": 120.00,
      },
      "type": "PROMO",
      "date_from": "2017-01-01T00:00:00.000Z",
      "date_thru": "2017-07-01T00:00:00.000Z",
      "is_public": true,
    }, {
      "amount": {
        "currency": { "code": "AUD" },
        "units": 149.00,
      },
      "type": "LIST",
      "date_from": "2016-01-01T00:00:00.000Z",
      "date_thru": null,
      "is_public": true,
    }, {
      "amount": {
        "currency": { "code": "AUD" },
        "units": 61.00,
      },
      "type": "PURCH",
      "date_from": "2016-01-01T00:00:00.000Z",
      "date_thru": null,
      "is_public": true,
    }, {
      "amount": {
        "currency": { "code": "AUD" },
        "units": 229.00,
      },
      "type": "LIST",
      "date_from": null,
      "date_thru": "2016-01-01T00:00:00.000Z",
      "is_public": true,
    }, {
      "amount": {
        "currency": { "code": "AUD" },
        "units": 94.00,
      },
      "type": "PURCH",
      "date_from": null,
      "date_thru": "2016-01-01T00:00:00.000Z",
      "is_public": true,
    }];

    $scope.table = {
      cols: [
        typeCol(),
        priceCol(),
        currencyCol(),
        validFromCol(),
        validThruCol(),
        isPublicCol(),
      ],
    };

    JsonSchema.load($scope.schemaUrl)
      .then(function (res) {
        console.log(res);
        $timeout(function () {
          $scope.schema = res;
          // Object.assign($scope.schema, res.data);
        });
      })
      .catch(err => {
        console.log(err);
      });

    function priceCol () {
      return col("price", "$ Price", function getCellValue (model, schema) {
        return model.amount.units;
      });
    }

    function currencyCol () {
      return col("currency", "Currency", function getCellValue (model, schema) {
        return model.amount.currency.code;
      });
    }

    function typeCol () {
      return col("type", "Type", function getCellValue (model, schema) {
        return model.type;
      });
    }

    function validFromCol () {
      return col("valid_from", "Valid From", function getCellValue (model, schema) {
        return model.date_from && model.date_from.split("T")[0] || "-";
      });
    }

    function validThruCol () {
      return col("valid_thru", "Valid Thru", function getCellValue (model, schema) {
        return model.date_thru && model.date_thru.split("T")[0] || "-";
      });
    }

    function isPublicCol () {
      return col("is_public", "Public", function getCellValue (model, schema) {
        let x = document.createElement("md-checkbox");
        x.innerHTML = "Yes";
        return x;
        // return model.is_public;
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
            alert(
              `Clicked '${key}' column, current value is '${value}' for` +
              ` model ${model}`
            );
          },
        },
      };
    }

  }

})(angular);
