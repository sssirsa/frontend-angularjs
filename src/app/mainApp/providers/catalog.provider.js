(function () {
    'use strict';

    angular
        .module('app.mainApp')
        .service('CATALOG', ['MobileRestangular', 'WebRestangular', '$http', CatalogProvider]);

    function CatalogProvider(MobileRestangular, WebRestangular, $http) {
        var vm = this;

        vm.mobileCatalog = {
            getByID: function (url, id) {
                return MobileRestangular.one(url, id)
                    .customGET();
            },
            list: function (url) {
                return MobileRestangular.all(url)
                    .getList();
            },
            create: function (url, object) {
                return MobileRestangular.all(url)
                    .customPOST(object);
            },
            update: function (url, id, object) {
                return MobileRestangular.all(url).all(id)
                    .customPUT(object);
            },
            remove: function (url, id) {
                return MobileRestangular.all(url)
                    .customDELETE(id, null, {'content-type': 'application/json'});
            }
        };

        vm.webCatalog = {
            getByID: function (url, id) {
                return WebRestangular.one(url, id)
                    .customGET();
            },
            list: function (url) {
                return WebRestangular.all(url)
                    .getList();
            },
            create: function (url, object) {
                return WebRestangular.all(url)
                    .customPOST(object);
            },
            update: function (url, id, object) {
                return WebRestangular.all(url).all(id)
                    .customPUT(object);
            },
            remove: function (url, id) {
                return WebRestangular.all(url)
                    .customDELETE(id, null, {'content-type': 'application/json'});
            }
        };

        vm.genericCatalog = {
            getByID: function (url, id) {
                return $http.get(
                    url + '/' + id);
            },
            list: function (url) {
                return $http.get(
                    url);
            },
            create: function (url, object) {
                return $http.post(
                    url, object);
            },
            update: function (url, id, object) {
                return $http.put(
                    url + '/' + id, object);
            },
            remove: function (url, id) {
                return $http.delete(
                    url + '/' + id);
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
