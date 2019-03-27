(function () {
    'use strict';

    angular
        .module('app.mainApp')
        .service('CATALOG', CatalogProvider);

    function CatalogProvider(MobileRestangular, WebRestangular, $http, $q) {
        var vm = this;

        vm.mobileCatalog = {
            url: null,
            getByID: function (id) {
                return MobileRestangular.one(vm.mobileCatalog.url, id)
                    .customGET();
            },
            list: function () {
                return MobileRestangular.all(vm.mobileCatalog.url)
                    .customGET();
            },
            create: function (object) {
                return MobileRestangular.all(vm.mobileCatalog.url)
                    .customPOST(object);
            },
            update: function (id, object) {
                return MobileRestangular.all(vm.mobileCatalog.url).all(id)
                    .customPUT(object);
            },
            remove: function (id) {
                return MobileRestangular.all(vm.mobileCatalog.url)
                    .customDELETE(id, null, { 'content-type': 'application/json' });
            },
            search: function (query) {
                return MobileRestangular.all(vm.mobileCatalog.url + '?' + query)
                    .customGET();
            }
        };

        vm.webCatalog = {
            url: null,
            getByID: function (id) {
                return WebRestangular.one(vm.webCatalog.url, id)
                    .customGET();
            },
            list: function () {
                return WebRestangular.all(vm.webCatalog.url)
                    .customGET();
            },
            create: function (object) {
                return WebRestangular.all(vm.webCatalog.url)
                    .customPOST(object);
            },
            update: function (id, object) {
                return WebRestangular.all(vm.webCatalog.url).all(id)
                    .customPUT(object);
            },
            remove: function (id) {
                return WebRestangular.all(vm.webCatalog.url)
                    .customDELETE(id, null, { 'content-type': 'application/json' });
            },
            search: function (query) {
                return WebRestangular.all(vm.webCatalog.url + '?' + query)
                    .customGET();
            }
        };

        vm.genericCatalog = {
            url: null,
            getByID: function (id) {
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
            create: function (object) {
                let deferred = $q.defer();
                $http.post(
                    vm.genericCatalog.url, object)
                    .then(function (response) {
                        deferred.resolve(response.data);
                    })
                    .catch(function (errorResponse) {
                        deferred.reject(errorResponse);
                    });
                return deferred.promise;
            },
            update: function (id, object) {
                let deferred = $q.defer();
                $http.put(
                    vm.genericCatalog.url + '/' + id, object)
                    .then(function (response) {
                        deferred.resolve(response.data);
                    })
                    .catch(function (errorResponse) {
                        deferred.reject(errorResponse);
                    });
                return deferred.promise;
            },
            remove: function (id) {
                let deferred = $q.defer();
                $http.delete(
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

        var service = {
            mobile: vm.mobileCatalog,
            web: vm.webCatalog,
            generic: vm.genericCatalog
        };

        return service;

    }

})();
