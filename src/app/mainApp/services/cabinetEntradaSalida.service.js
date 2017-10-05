/**
 * Created by Emmanuel on 24/08/2016.
 */
(function () {

    'use strict';

    angular
        .module('app.mainApp')
        .factory('CabinetEntradaSalida', CabinetEntradaSalida);

    function CabinetEntradaSalida(Restangular, URLS, EnvironmentConfig) {
        //var baseURL = Restangular.all('cabinet_entrada_salida');
        var baseURL = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                baseURL = Restangular.all(URLS.environment.genesis_dev).all('cabinet_entrada_salida');
                break;
            case 'staging':
                baseURL = Restangular.all(URLS.environment.genesis_stg).all('cabinet_entrada_salida');
                break;
            case 'production':
                baseURL = Restangular.all(URLS.environment.genesis).all('cabinet_entrada_salida');
                break;
            case 'local':
                baseURL = Restangular.all(URLS.environment.genesis_local).all('cabinet_entrada_salida');
                break;
        }

        return {
            getLastEntradaByCabinet: getLastEntradaByCabinet,
            create:create,
            restore:restore
        };
        function restore(object) {
            return baseURL.all('restore').post(object);
        }
        function getLastEntradaByCabinet(idCabinet) {
            return baseURL.one('lastInput').one('cabinet').customGET(idCabinet);
        }
        function create(object){
            return baseURL.post(object);
        }

    }
})();
