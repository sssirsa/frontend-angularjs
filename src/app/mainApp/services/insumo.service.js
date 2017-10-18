/**
 * Created by franciscojaviercerdamartinez on 11/09/16.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .factory('Insumo', Insumo);

    /* @ngInject */
    function Insumo($q, Restangular, EnvironmentConfig, URLS) {
        // var path=Restangular.all('insumo');

        var path = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                path = Restangular.all(URLS.environment.genesis_dev).all('insumo');
                break;
            case 'staging':
                path = Restangular.all(URLS.environment.genesis_stg).all('insumo');
                break;
            case 'production':
                path = Restangular.all(URLS.environment.genesis).all('insumo');
                break;
            case 'local':
                path = Restangular.all(URLS.environment.genesis_local).all('insumo');
                break;
        }
        return {

            getInsumosByCatalogo: getInsumosByCatalogo,
            getUsedInsumos: getUsedInsumos,
            getNoUsedInsumos: getNotUsedInsumos,
            getAllInsumos: getAllInsumos,
            create:create
        };

        function getInsumosByCatalogo(catalogo) {
            var deferred = $q.defer();
            Restangular.all('insumo').one('catalog', catalogo).customGET().then(function (res) {
                deferred.resolve(res);
            }).catch(function (err) {
                deferred.reject(false);
            });
            return deferred.promise;
        }

        function getUsedInsumos() {
            var deferred = $q.defer();
            Restangular.all('insumo').all('used').customGET().then(function (res) {
                deferred.resolve(res);
            }).catch(function (err) {
                deferred.reject(res);
            });
            return deferred.promise;
        }

        function getNotUsedInsumos() {
            var deferred = $q.defer();
            Restangular.all('insumo').all('used').customGET().then(function (res) {
                deferred.resolve(res);
            }).catch(function (err) {
                deferred.reject(res);
            });
            return deferred.promise;
        }

        function getAllInsumos() {
            var deferred = $q.defer();
            Restangular.all('insumo').customGET().then(function (res) {
                deferred.resolve(res);
            }).catch(function (err) {
                deferred.reject(res);
            });
            return deferred.promise;
        }

        function create(object){
            return path.post(object);
        }

    }
})();
