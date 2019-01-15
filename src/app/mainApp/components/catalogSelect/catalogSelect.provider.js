(function () {
    'use strict';

    angular
        .module('app.mainApp')
        .service('CATALOG_SELECT', CatalogProvider);

    function CatalogProvider(
        API,
        $http,
        $q,
        URLS) {
        var vm = this;

        vm.mobileCatalog = {
            url: null,
            list: function () {
                return API.all(URLS.mobile.base).all(vm.mobileCatalog.url)
                    .customGET();
            },
            search: function (query) {
                return API.all(URLS.mobile.base).all(vm.mobileCatalog.url + '?' + query)
                    .customGET();
            }
        };

        vm.webCatalog = {
            url: null,
            list: function () {
                return API.all(URLS.genesis.base).all(vm.webCatalog.url)
                    .customGET();
            },
            search: function (query) {
                return API.all(URLS.genesis.base).all(vm.webCatalog.url + '?' + query)
                    .customGET();
            }
        };

        vm.managementCatalog = {
            url: null,
            list: function () {
                return API.all(URLS.management.base).all(URLS.management.catalogues.base).all(vm.managementCatalog.url)
                    .customGET();
            },
            search: function (query) {
                return API.all(URLS.management.base).all(URLS.management.catalogues.base).all(vm.managementCatalog.url + '?' + query)
                    .customGET();
            }
        };

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

        var service = {
            mobile: vm.mobileCatalog,
            web: vm.webCatalog,
            generic: vm.genericCatalog,
            management:vm.managementCatalog
        };

        return service;

    }

})();
