
(function (angular) {

  "use strict";

  const AppBuilder3 = angular.module("AppBuilder3");

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

})(angular);
