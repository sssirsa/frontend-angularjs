(function () {
    'use strict';

    angular
        .module('app.mainApp')
        .factory('CATALOG', CatalogProvider);

    function CatalogProvider(MobileRestangular, WebRestangular, $http) {
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
            }
        };

        vm.genericCatalog = {
            url: null,
            getByID: function (id) {
                return $http.get(
                    vm.genericCatalog.url + '/' + id);
            },
            list: function () {
                return $http.get(
                    vm.genericCatalog.url);
            },
            create: function (object) {
                return $http.post(
                    vm.genericCatalog.url, object);
            },
            update: function (id, object) {
                return $http.put(
                    vm.genericCatalog.url + '/' + id, object);
            },
            remove: function (id) {
                return $http.delete(
                    vm.genericCatalog.url + '/' + id);
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
