
(function () {

  "use strict";

  const AppBuilder3 = angular.module("AppBuilder3", [
    "ngMaterial",
  ]);

  AppBuilder3.controller("FormController", FormController);

  FormController.$inject = ["$scope", "$timeout", "JsonSchema"];
  function FormController (  $scope,   $timeout,   JsonSchema) {

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

  }

  AppBuilder3.controller("ArrayDirectiveController", ArrayDirectiveController);

  ArrayDirectiveController.$inject = ["$scope"];
  function ArrayDirectiveController (  $scope) {

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

  JsonSchemaFactory.$inject = ["fetchSchema", "$timeout"];
  function JsonSchemaFactory (  fetchSchema,   $timeout) {
    class JsonSchema {
      static get LOADING () {
        return "LOADING";
      }
      static load (url) {
        return new Promise((resolve, reject) => {
          fetchSchema(url)
            .then(res => {
              let jsonSchema;
              let data = res.data;
              let jsonString = JSON.stringify(data, undefined, "  ");
              let subrefs = jsonString.match(/\"\$ref\"\: \"(.+)/gm);
              if (!subrefs) {
                resolve(new JsonSchema(res.data));
                return;
              }
              let schemas = [];
              let subrefUrls = subrefs.map(v => {
                return v.substr(9).substr(0,v.length-10);
              });
              subrefUrls.forEach(url => {
                schemas.push(fetchSchema(url));
              });
              Promise.all(schemas)
                .then(() => {
                  resolve(new JsonSchema(res.data));
                })
                .catch(err => {
                  reject(err);
                });
            });
        });
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
      Object.keys(properties).forEach(k => {
        let v = properties[k];
        let isArray = "array" === v.type;
        let ref = v.$ref || isArray && v.items.$ref;
        if (!ref) {
          jsonSchema.properties[k] = v;
          return;
        }
        if ("array" === v.type) {
          v.items = JsonSchema.LOADING;
          jsonSchema.properties[k] = v;
        }
        else {
          jsonSchema.properties[k] = JsonSchema.LOADING;
        }
        fetchSchema(ref)
          .then(res => {
            $timeout(function () {
              let schema = new JsonSchema(res.data);
              if (isArray) {
                console.log(res);
                jsonSchema.properties[k].items = schema;
                return;
              }
              jsonSchema.properties[k] = schema;
            });
          })
          .catch(err => {
            console.log(`failed to fetch ref ${ref}:`);
            console.log(err);
          });
      });
    }
  }

  AppBuilder3.directive("abArray", abArrayDirective);

  abArrayDirective.$inject = ["$compile", "JsonSchema"];
  function abArrayDirective (  $compile,   JsonSchema) {

    return {
      restrict: "E",
      require: ["^^abFormField"],
      link: link,
      controller: "ArrayDirectiveController",
    };

    function link (scope, el, attrs, ctrl) {
      let formEl;
      let arrEl = document.createElement("div");
      arrEl.innerHTML = scope.abPropKey;
      el[0].appendChild(arrEl);
      scope.form = [
        "*",
        {
          type: "submit",
          title: "Save"
        }
      ];
      scope.model = {};
      scope.$watch("abPropValue.items", (newValue) => {
        console.log("***********************");
        console.log(newValue);
      })
      formEl = document.createElement("form");
      formEl.setAttribute("ab-schema", "abPropValue.items");
      formEl.setAttribute("ab-form", "form");
      formEl.setAttribute("ab-model", "model");
      formEl.setAttribute("layout", "column");
      $compile(el[0].appendChild(formEl))(scope);
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

      let n = inputEl(scope.abPropKey, scope.abPropValue);
      n.setAttribute("flex", "");
      $compile(el[0].appendChild(n))(scope);

      scope.$watch("abPropValue", (newValue) => {
        console.log(newValue);
      });

      function materialInputWrapper (key, value) {
        let div = document.createElement("md-input-container");
        div.setAttribute("class", "prop-" + key);
        div.appendChild(labelEl(key));
        div.appendChild(stringInputEl(key, value));
        return div;
      }

      function labelEl (key) {
        let label = document.createElement("label");
        label.innerHTML = key;
        return label;
      }

      function inputEl (key, value) {
        switch (value.type) {
          case "string":
            return materialInputWrapper(key, value);
          case "number":
            return numberInputEl(key, value);
          case "array":
            return arrayMgmtEl(key, value);
          case "boolean":
            return checkboxEl(key, value);
        }
      }

      function numberInputEl (key, value) {
        let div = document.createElement("md-input-container");
        div.setAttribute("class", "prop-" + key);
        let inputEl = document.createElement("input");
        inputEl.setAttribute("ng-model", "abModel");
        inputEl.setAttribute("type", "number");
        div.appendChild(labelEl(key));
        div.appendChild(inputEl);
        return div;
      }

      function stringInputEl (key, value)  {
        switch (value.format) {
          case "date-time":
            return dateStringInputEl(key, value);
          case "text":
            // no break
          default:
            return textStringInputEl(key, value);
        }
      }

      function dateStringInputEl (key, value)  {
        let input = document.createElement("md-datepicker");
        input.setAttribute("ng-model", "abModel");
        return input;
      }

      function textStringInputEl (key, value)  {
        let input = document.createElement("input");
        input.setAttribute("ng-model", "abModel");
        return input;
      }

      function checkboxEl (key, value)  {
        let checkbox = document.createElement("md-checkbox");
        checkbox.setAttribute("ng-model", "abModel");
        checkbox.appendChild(labelEl(key));
        return checkbox;
      }

      function arrayMgmtEl (key, value) {
        let arrayMgmt = document.createElement("ab-array");
        arrayMgmt.setAttribute("ab-schema", "abPropValue.items");
        arrayMgmt.setAttribute("ab-model", "abModel");
        return arrayMgmt;
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
        el.setAttribute("layout", "");
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

})(angular);
