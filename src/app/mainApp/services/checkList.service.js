/**
 * Created by franciscojaviercerdamartinez on 18/07/16.
 */
(function() {
    'use strict';

    angular
        .module('app')
        .factory('CheckList', CheckList);

    /* @ngInject */
    function CheckList($q, Restangular, EnvironmentConfig, URLS) {
        var urlbase = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                urlbase = Restangular.all(URLS.environment.genesis_dev).all('CheckList');
                break;
            case 'staging':
                urlbase = Restangular.all(URLS.environment.genesis_stg).all('CheckList');
                break;
            case 'production':
                urlbase = Restangular.all(URLS.environment.genesis).all('CheckList');
                break;
            case 'local':
                urlbase = Restangular.all(URLS.environment.genesis_local).all('CheckList');
                break;
        }

        var service = {
            crearCheckListServicio: crearCheckListServicio,
            consultarCheckListServicio: consultarCheckListServicio,
            editarCheckListServicio: editarCheckListServicio,
            eliminarCheckListServicio: eliminarCheckListServicio,
            getAllCheckListServicio: getAllCheckListServicio
        };


        function crearCheckListServicio(CheckList) {
            // var deferred = $q.defer();
            // Restangular.all('').customPOST(CheckList).then(function (res) {
            //     deferred.resolve(res);
            // }).catch(function (err) {
            //     deferred.reject(false);
            // });
            //
            // return deferred.promise;
            return urlbase.customPOST(CheckList);
        }

        function consultarCheckListServicio(CheckList) {
            // var deferred = $q.defer();
            // //checar rutas :D
            // Restangular.one('CheckList', CheckList.id).customGET(CheckList).then(function (res) {
            //     deferred.resolve(res);
            // }).catch(function (err) {
            //     deferred.reject(err);
            // });
            //
            //
            // return deferred.promise;
            return urlbase.all(CheckList.id).customGET(CheckList);
        }

        function editarCheckListServicio(CheckList) {

            // var deferred = $q.defer();
            //
            // Restangular.all('CheckList').one('CheckList', CheckList.id).customPOST(CheckList).then(function (res) {
            //     deferred.resolve(res);
            // }).catch(function (err) {
            //     deferred.reject(err);
            // });
            //
            //
            // return deferred.promise;
            return urlbase.one('CheckList', CheckList.id).customPOST(CheckList);
        }

        function eliminarCheckListServicio(CheckList) {
            // var deferred = $q.defer();
            //
            // Restangular.one('CheckList', CheckList.id).customDELETE().then(function (res) {
            //     deferred.resolve(res);
            // }).catch(function (err) {
            //     deferred.reject(err);
            // });
            //
            //
            // return deferred.promise;
            return urlbase.all(CheckList.id).customDELETE();
        }


        function getAllCheckListServicio(CheckList) {
            // var deferred = $q.defer();
            // Restangular.one('CheckList', CheckList.idCabinet).customGET(CheckList).then(function (res) {
            //     deferred.resolve(res);
            // }).catch(function (err) {
            //     deferred.reject(err);
            // });
            //
            //
            // return deferred.promise;
            return urlbase.all(CheckList.idCabinet).customGET(CheckList);
        }

    }

})();
