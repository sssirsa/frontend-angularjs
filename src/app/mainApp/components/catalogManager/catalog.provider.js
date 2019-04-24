(function () {
    'use strict';

    angular
        .module('app.mainApp')
        .factory('CATALOG', CatalogProvider);

    function CatalogProvider(
        $http,
        $q
        ) {
        var vm = this;
        
        vm.genericCatalog = {
            url: null,
            getByID: function (id) {
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
            create: function (object) {
                var deferred = $q.defer();
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
                var deferred = $q.defer();
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
            patch: function (id, object) {
                var deferred = $q.defer();
                $http.patch(
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
                var deferred = $q.defer();
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
