(function () {
    'use strict';

    angular
        .module('catalogSelectComponent')
        .factory('CATALOG_SELECT', CatalogSelectProvider);

    function CatalogSelectProvider(
        $http,
        $q
    ) {
        var vm = this;

        vm.genericCatalog = {
            url: null,
            list: function () {
                var deferred = $q.defer();
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
                var deferred = $q.defer();
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
                var deferred = $q.defer();
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
