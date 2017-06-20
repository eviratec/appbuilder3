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
      get name () {
        return this.id.split(/\//g).slice(-1)[0];
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

})(angular);
