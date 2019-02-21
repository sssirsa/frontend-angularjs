(function () {
    'use strict';

    angular
        .module('app.mainApp')
        .service('CATALOG_SELECT', CatalogSelectProvider);

    function CatalogSelectProvider(
        $http,
        $q,
        API,
        URLS
    ) {
        var vm = this;

        vm.genericCatalog = {
            url: null,
            list: function () {
                let deferred = $q.defer();
                $http.get(
                    vm.genericCatalog.url)
                    .then(function (response) {
                        deferred.resolve(response.data);
                    })
                    .catch(function (errorResponse) {
                        deferred.reject(errorResponse);
                    });
                return deferred.promise;
            },
            detail: function (id) {
                let deferred = $q.defer();
                $http.get(
                    vm.genericCatalog.url + '/' + id)
                    .then(function (response) {
                        deferred.resolve(response.data);
                    })
                    .catch(function (errorResponse) {
                        deferred.reject(errorResponse);
                    });
                return deferred.promise;
            },
            search: function (query) {
                let deferred = $q.defer();
                $http.get(
                    vm.genericCatalog.url + '?' + query)
                    .then(function (response) {
                        deferred.resolve(response.data);
                    })
                    .catch(function (errorResponse) {
                        deferred.reject(errorResponse);
                    });
                return deferred.promise;
            }
        };

        var service = vm.genericCatalog;

        return service;

    }

})();
