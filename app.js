
(function () {

  "use strict";

  const AppBuilder3 = angular.module("AppBuilder3", [
    "ngMaterial",
  ]);

  AppBuilder3.controller("FormController", FormController);

  FormController.$inject = ["$scope", "$timeout", "fetchSchema"];
  function FormController (  $scope,   $timeout,   fetchSchema) {

    $scope.schemaUrl = "https://raw.githubusercontent.com/eviratec/schema/master/v1/customer.json#";
    $scope.schema = {};
    $scope.form = [
      "*",
      {
        type: "submit",
        title: "Save"
      }
    ];
    $scope.model = {};

    fetchSchema($scope.schemaUrl)
      .then(function (res) {
        console.log(res.data);
        $timeout(function () {
          $scope.schema = res.data;
          // Object.assign($scope.schema, res.data);
        });
      });

  }

  AppBuilder3.controller("FormFieldDirectiveController", FormFieldDirectiveController);

  FormFieldDirectiveController.$inject = ["$scope"];
  function FormFieldDirectiveController (  $scope) {

  }

  AppBuilder3.controller("FormDirectiveController", FormDirectiveController);

  FormDirectiveController.$inject = ["$scope"];
  function FormDirectiveController (  $scope) {
    $scope.foo = "bars";
  }

  AppBuilder3.factory("fetchSchema", fetchSchemaFactory);

  fetchSchemaFactory.$inject = ["$http"];
  function fetchSchemaFactory (  $http) {

    let schemaCache = {};

    return function fetchSchema (url) {
      return new Promise((resolve, reject) => {

        if (isCached(url)) {
          resolve(cachedResponse(url));
          return;
        }

        $http.get(url).then(res => {
          cache(url, res);
          resolve(res);
        }, err => {
          reject(err);
        });

      });
    };

    function cachedResponse (url) {
      return schemaCache[url];
    }

    function cache (url, res) {
      return schemaCache[url] = res;
    }

    function isCached (url) {
      return url in schemaCache;
    }

  }

  AppBuilder3.factory("JsonSchema", JsonSchemaFactory);

  JsonSchemaFactory.$inject = ["fetchSchema"];
  function JsonSchemaFactory (  fetchSchema) {
    class JsonSchema {
      static get LOADING () {
        return "LOADING";
      }
      constructor (d) {
        this._d = d;
        this.id = d.id;
        this.$schema = d.$schema;
        this.description = d.description;
        this.type = d.type;
        this.additionalProperties = d.additionalProperties;
        this.required = d.required;
        this.properties = {};
        this.subrefs = JSON.stringify(d, undefined, "  ").match(/\"\$ref\"\: \"(.+)/gm);
        hydrate(this, d.properties);
      }
      forEachProp (fn) {
        Object.keys(this.properties).forEach(k => {
          let v = this.properties[k];
          fn(k, v);
        });
      }
    }
    return JsonSchema;
    function hydrate (jsonSchema, properties) {
      let subrefUrls = [];
      if (jsonSchema.subrefs) {
        subrefUrls.push(...jsonSchema.subrefs.map(v => {
          return v.substr(9).substr(0,v.length-10);
        }));
        // console.log(subrefUrls);
      }
      Object.keys(properties).forEach(k => {
        let v = properties[k];
        let ref = v.$ref || "array" === v.type && v.items.$ref;
        if (!ref) {
          jsonSchema.properties[k] = v;
          return;
        }
        if ("array" === v.type) {
          v.items = JsonSchema.LOADING;
          jsonSchema.properties[k] = v;
          return;
        }
        jsonSchema.properties[k] = JsonSchema.LOADING;
        fetchSchema(ref)
          .then(res => {
            let schema = new JsonSchema(res.data);
            if ("array" === v.type) {
              jsonSchema.properties[k].items = v;
              return;
            }
            jsonSchema.properties[k] = schema;
          })
          .catch(err => {
            console.log(`failed to fetch ref ${ref}:`);
            console.log(err);
          });
      });
    }
  }

  AppBuilder3.directive("abFormField", abFormFieldDirective);

  abFormFieldDirective.$inject = ["$compile", "JsonSchema"];
  function abFormFieldDirective (  $compile,   JsonSchema) {

    return {
      restrict: "E",
      // require: ["^^abForm"],
      link: link,
      scope: {
        abPropKey: "@",
        abPropValue: "=",
        abModel: "=",
      },
      controller: "FormFieldDirectiveController",
    };

    function link (scope, el, attrs, ctrl) {

      // console.log(scope,el,attrs,ctrl);
      console.log(scope.abPropKey, scope.abPropValue);
      console.log(ctrl);

      let n = materialInputWrapper(scope.abPropKey, scope.abPropValue);
      $compile(el[0].appendChild(n))(scope);

      function materialInputWrapper (key, value) {
        let div = document.createElement("md-input-container");
        div.setAttribute("class", "prop-" + key);
        div.appendChild(labelEl(key));
        div.appendChild(inputEl(key, value));
        return div;
      }

      function labelEl (key) {
        let label = document.createElement("label");
        label.innerHTML = key;
        return label;
      }

      function inputEl (key, value) {
        let input = document.createElement("input");
        input.setAttribute("ng-model", "abModel");
        return input;
      }

    }

  }

  AppBuilder3.directive("abForm", abFormDirective);

  abFormDirective.$inject = ["$compile", "JsonSchema"];
  function abFormDirective (  $compile,   JsonSchema) {

    return {
      restrict: "A",
      link: link,
      scope: {
        abSchema: "=",
        abForm: "=",
        abModel: "=",
      },
      controller: "FormDirectiveController",
      transclude: true,
    };

    function link (scope, el, attrs, ctrl) {

      ctrl.schema = scope.abSchema;
      ctrl.form = scope.abForm;
      ctrl.model = scope.abModel;

      scope.$watch("abSchema", (newValue) => {
        if (undefined === newValue || !newValue.$schema) {
          return;
        }
        ctrl.schema = newValue;
        let schema = new JsonSchema(newValue);
        el[0].innerHTML = "";
        schema.forEachProp((key, value) => {
          console.log(value);
          let propEl = abFormField(key, value);
          $compile(el[0].appendChild(propEl))(scope);
        });
        console.log(schema);
      });


      // function testDiv (key, value) {
      //   let div = document.createElement("div");
      //   div.setAttribute("class", "prop-" + key);
      //   div.innerHTML = key + "=" + JSON.stringify(value);
      //   return div;
      // }

      function abFormField (key, value) {
        let el = document.createElement("ab-form-field");
        el.setAttribute("class", "prop-" + key);
        el.setAttribute("ab-prop-key", key);
        el.setAttribute("ab-prop-value", "abSchema.properties." + key);
        el.setAttribute("ab-model", "abModel." + key);
        // el.appendChild(materialInputWrapper(key, value));
        return el;
      }

      // console.log("abForm");
      // console.log(scope.abSchema);
      // console.log(scope.abForm);
      // console.log(scope.abModel);
      // console.log(scope);
      // console.log(el);
      // console.log(attrs);
      // console.log(ctrl);

    }

  }

  AppBuilder3.directive("abModel", abModelDirective);

  abModelDirective.$inject = [];
  function abModelDirective () {

    return {
      restrict: "A",
      // require: ["abForm"],
      link: link,
    };

    function link (scope, el, attrs, ctrl) {

      // console.log("abModel");
      // console.log(scope);
      // console.log(el);
      // console.log(attrs);
      // console.log(ctrl);

    }

  }

  AppBuilder3.directive("abSchema", abSchemaDirective);

  abSchemaDirective.$inject = [];
  function abSchemaDirective () {

    return {
      restrict: "A",
      require: ["abForm"],
      link: link,
    };

    function link (scope, el, attrs, ctrl) {

      // console.log("abSchema");
      // console.log(scope);
      // console.log(el);
      // console.log(attrs);
      // console.log(ctrl);

    }

  }

})(angular);
