"use strict";

describe("Case #2: abTable with <eviratec/schema/v1/product/price> schema", function () {

  const SCHEMA_URL = "/base/test/spec/productPriceTable/data/schema.json";
  const MODELS_URL = "/base/test/spec/productPriceTable/data/models.json";

  let JsonSchema;
  let $compile;
  let $rootScope;

  let table;

  beforeEach(module('AppBuilder3'));

  beforeEach(inject(function (_JsonSchema_, _$compile_, _$rootScope_) {

    JsonSchema = _JsonSchema_;
    $compile = _$compile_;
    $rootScope = _$rootScope_;

    table = newTable();

  }));

  describe("Table Header", function () {

    let schema;
    let models;

    beforeEach(function (done) {
      readJSON(SCHEMA_URL, function (err, res) {
        schema = new JsonSchema(res);
        readJSON(MODELS_URL, function (err, res) {
          models = res;
          done();
        });
      });
    });

    it("Adds the appropriate column header cells", function () {

      var element;
      var $scope = $rootScope.$new(true);

      $scope.table = table;
      $scope.schema = schema;
      $scope.models = models;

      element = $compile("<div ab-table=\"table\" ab-schema=\"schema\" ab-models=\"models\"></div>")($scope);

      $scope.$digest();

      expect(element.html()).toContain("table-header");
      expect(element.html()).toContain("Type");
      expect(element.html()).toContain("$ Price");
      expect(element.html()).toContain("Currency");
      expect(element.html()).toContain("Valid From");
      expect(element.html()).toContain("Valid Thru");
      expect(element.html()).toContain("Public");

    });

  });

  describe("Table Data", function () {

    let schema;
    let models;

    beforeEach(function (done) {
      readJSON(SCHEMA_URL, function (err, res) {
        schema = new JsonSchema(res);
        readJSON(MODELS_URL, function (err, res) {
          models = res;
          done();
        });
      });
    });

    it("Adds the appropriate content", function () {

      var element;
      var $scope = $rootScope.$new(true);

      $scope.table = table;
      $scope.schema = schema;
      $scope.models = models;

      element = $compile("<div ab-table=\"table\" ab-schema=\"schema\" ab-models=\"models\"></div>")($scope);

      $scope.$digest();

      expect(element.html()).toContain(">PROMO<");
      expect(element.html()).toContain(">LIST<");
      expect(element.html()).toContain(">PURCH<");
      expect(element.html()).toContain(">120<");
      expect(element.html()).toContain(">61<");
      expect(element.html()).toContain(">149<");
      expect(element.html()).toContain(">AUD<");
      expect(element.html()).toContain(">2016-01-01<");
      expect(element.html()).toContain(">2017-01-01<");
      expect(element.html()).toContain(">2017-07-01<");
      expect(element.html()).toContain(">true<");

    });

    it("Adds the correct number of cells", function () {

      let element;
      let $scope = $rootScope.$new(true);

      $scope.table = table;
      $scope.schema = schema;
      $scope.models = models;

      element = $compile("<div ab-table=\"table\" ab-schema=\"schema\" ab-models=\"models\"></div>")($scope);

      $scope.$digest();

      let cellCount = element.html().match(/\<ab\-table\-cell /g).length;

      expect(cellCount).toBe(30);

    });

  });

});
