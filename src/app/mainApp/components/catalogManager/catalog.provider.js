(function () {
    'use strict';

    angular
        .module('app.mainApp')
        .service('CATALOG', CatalogProvider);

    function CatalogProvider(
        $http,
        $q,
        API,
        URLS
        ) {
        var vm = this;
        
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
        
        var service = vm.genericCatalog;

        return service;

    }

})();
