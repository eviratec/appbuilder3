"use strict";

function newTable () {

  return {
    cols: [
      typeCol(),
      priceCol(),
      currencyCol(),
      validFromCol(),
      validThruCol(),
      isPublicCol(),
    ],
  };

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
      return model.is_public;
    });
  }

  function col (property, label, getValueFn) {
    return {
      "property": property,
      "headers": {
        "label": label,
      },
      "cells": {
        "value": function (model, schema) {
          try {
            return getValueFn(model, schema);
          }
          catch (err) {
            console.log(err.stack);
          }
          return "";
        },
        /**
         * @todo add jasmine spy for onClick
         */
      },
    };
  }

}
