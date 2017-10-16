(function() {
    'use strict';

    angular
        .module('app')
        .factory('Diagnostico', Diagnostico);

    /* @ngInject */
    function Diagnostico($q, Restangular, EnvironmentConfig, URLS) {
        var diagnosticoBase = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                diagnosticoBase = Restangular.all(URLS.environment.genesis_dev).all('diagnostico');
                break;
            case 'staging':
                diagnosticoBase = Restangular.all(URLS.environment.genesis_stg).all('diagnostico');
                break;
            case 'production':
                diagnosticoBase = Restangular.all(URLS.environment.genesis).all('diagnostico');
                break;
            case 'local':
                diagnosticoBase = Restangular.all(URLS.environment.genesis_local).all('diagnostico');
                break;
        }

        var diagnosticoCabinetBase = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                diagnosticoCabinetBase = Restangular.all(URLS.environment.genesis_dev).all('diagnostico_cabinet');
                break;
            case 'staging':
                diagnosticoCabinetBase = Restangular.all(URLS.environment.genesis_stg).all('diagnostico_cabinet');
                break;
            case 'production':
                diagnosticoCabinetBase = Restangular.all(URLS.environment.genesis).all('diagnostico_cabinet');
                break;
            case 'local':
                diagnosticoCabinetBase = Restangular.all(URLS.environment.genesis_local).all('diagnostico_cabinet');
                break;
        }

        return {
            create: create,
            get: get,
            getAllByCabinet: getAllByCabinet,
            remove: remove,
            modify: modify,
            lastDiagnosticInput:lastDiagnosticInput,
            lastDiagnosticOutput:lastDiagnosticOutput
        };

        function lastDiagnosticInput(id) {
            // var deferred = $q.defer();
            // Restangular.all('diagnostico').one('latest',id).customGET().then(function (res) {
            //     deferred.resolve(res);
            // }).catch(function (err) {
            //     deferred.reject(err);
            // });
            // return deferred.promise;
            return diagnosticoBase.one('latest',id).customGET();
        }
        function lastDiagnosticOutput(id) {
            // var deferred = $q.defer();
            // Restangular.all('diagnostico').one('latest_salida',id).customGET().then(function (res) {
            //     deferred.resolve(res);
            // }).catch(function (err) {
            //     deferred.reject(err);
            // });
            // return deferred.promise;
            return diagnosticoBase.one('latest_salida',id).customGET();
        }
        function create(request) {
            // var deferred = $q.defer();
            // Restangular.all('diagnostico_cabinet').customPOST(request).then(function (res) {
            //     deferred.resolve(res);
            // }).catch(function (err) {
            //     deferred.reject(err);
            // });
            // return deferred.promise;
            return diagnosticoCabinetBase.customPOST(request);
        }

        function get(id) {
            // var deferred = $q.defer();
            // Restangular.one('diagnostico_cabinet',id).customGET().then(function (res) {
            //     deferred.resolve(res);
            // }).catch(function (err) {
            //     deferred.reject(err);
            // });
            // return deferred.promise;
            return diagnosticoCabinetBase.all(id).customGET();
        }

        function getAllByCabinet(id) {
            // var deferred = $q.defer();
            // Restangular.all('diagnostico').one('all',id).customGET().then(function (res) {
            //     deferred.resolve(res);
            // }).catch(function (err) {
            //     deferred.reject(err);
            // });
            // return deferred.promise;
            return diagnosticoBase.one('all',id).customGET();
        }

        function remove(id) {
            // var deferred = $q.defer();
            //
            // Restangular.one('diagnostico_cabinet',id).customDELETE().then(function (res) {
            //     deferred.resolve(res);
            // }).catch(function (err) {
            //     deferred.reject(err);
            // });
            // return deferred.promise;
            return diagnosticoCabinetBase.all(id).customDELETE();
        }


        function modify(request) {
            // var deferred = $q.defer();
            // Restangular.one('diagnostico_cabinet', request.id).customPUT(request).then(function (res) {
            //     deferred.resolve(res);
            // }).catch(function (err) {
            //     deferred.reject(err);
            // });
            // return deferred.promise;
            return diagnosticoCabinetBase.all(request.id).customPUT(request);
        }
    }
})();
