(function () {
    'use strict';

    angular
        .module('app.mainApp')
        .service('CATALOG_SELECT', CatalogProvider);

    function CatalogProvider(MobileRestangular, WebRestangular, $http, $q) {
        var vm = this;

        vm.mobileCatalog = {
            url: null,
            list: function () {
                return MobileRestangular.all(vm.mobileCatalog.url)
                    .customGET();
            },
            search: function (query) {
                return MobileRestangular.all(vm.mobileCatalog.url + '?' + query)
                    .customGET();
            }
        };

        vm.webCatalog = {
            url: null,
            list: function () {
                return WebRestangular.all(vm.webCatalog.url)
                    .customGET();
            },
            search: function (query) {
                return WebRestangular.all(vm.webCatalog.url + '?' + query)
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
            generic: vm.genericCatalog
        };

        return service;

    }

})();
