(function () {
    'use strict';

    angular
        .module('app.mainApp')
        .service('CATALOG', CatalogProvider);

    function CatalogProvider(
        API,
        $http,
        $q,
        URLS) {
        var vm = this;

        vm.mobileCatalog = {
            url: null,
            getByID: function (id) {
                return API.all(URLS.mobile.base).one(vm.mobileCatalog.url, id)
                    .customGET();
            },
            list: function () {
                return API.all(URLS.mobile.base).all(vm.mobileCatalog.url)
                    .customGET();
            },
            create: function (object) {
                return API.all(URLS.mobile.base).all(vm.mobileCatalog.url)
                    .customPOST(object);
            },
            update: function (id, object) {
                return API.all(URLS.mobile.base).all(vm.mobileCatalog.url).all(id)
                    .customPUT(object);
            },
            remove: function (id) {
                return API.all(URLS.mobile.base).all(vm.mobileCatalog.url)
                    .customDELETE(id, null, { 'content-type': 'application/json' });
            },
            search: function (query) {
                return API.all(URLS.mobile.base).all(vm.mobileCatalog.url + '?' + query)
                    .customGET();
            }
        };

        vm.webCatalog = {
            url: null,
            getByID: function (id) {
                return API.all(URLS.genesis.base).one(vm.webCatalog.url, id)
                    .customGET();
            },
            list: function () {
                return API.all(URLS.genesis.base).all(vm.webCatalog.url)
                    .customGET();
            },
            create: function (object) {
                return API.all(URLS.genesis.base).all(vm.webCatalog.url)
                    .customPOST(object);
            },
            update: function (id, object) {
                return API.all(URLS.genesis.base).all(vm.webCatalog.url).all(id)
                    .customPUT(object);
            },
            remove: function (id) {
                return API.all(URLS.genesis.base).all(vm.webCatalog.url)
                    .customDELETE(id, null, { 'content-type': 'application/json' });
            },
            search: function (query) {
                return API.all(URLS.genesis.base).all(vm.webCatalog.url + '?' + query)
                    .customGET();
            }
        };

        vm.managementCatalog = {
            url: null,
            getByID: function (id) {
                return API.all(URLS.management.base).all(URLS.management.catalogues.base).one(vm.managementCatalog.url, id)
                    .customGET();
            },
            list: function () {
                return API.all(URLS.management.base).all(URLS.management.catalogues.base).all(vm.managementCatalog.url)
                    .customGET();
            },
            create: function (object) {
                return API.all(URLS.management.base).all(URLS.management.catalogues.base).all(vm.managementCatalog.url)
                    .customPOST(object);
            },
            update: function (id, object) {
                return API.all(URLS.management.base).all(URLS.management.catalogues.base).all(vm.managementCatalog.url).all(id)
                    .customPUT(object);
            },
            remove: function (id) {
                return API.all(URLS.management.base).all(URLS.management.catalogues.base).all(vm.managementCatalog.url)
                    .customDELETE(id, null, { 'content-type': 'application/json' });
            },
            search: function (query) {
                return API.all(URLS.management.base).all(URLS.management.catalogues.base).all(vm.managementCatalog.url + '?' + query)
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
            generic: vm.genericCatalog,
            management:vm.managementCatalog
        };

        return service;

    }

})();
