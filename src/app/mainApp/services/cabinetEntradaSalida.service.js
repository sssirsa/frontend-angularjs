/**
 * Created by Emmanuel on 24/08/2016.
 */
(function () {

    'use strict';

    angular
        .module('app.mainApp')
        .factory('CabinetEntradaSalida', CabinetEntradaSalida);

    function CabinetEntradaSalida( Restangular) {
        //var baseURL = Restangular.all('cabinet_entrada_salida');
        var urlbase = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                urlbase = Restangular.all(URLS.environment.genesis_dev);
                break;
            case 'staging':
                urlbase = Restangular.all(URLS.environment.genesis_stg);
                break;
            case 'production':
                urlbase = Restangular.all(URLS.environment.genesis);
                break;
            case 'local':
                urlbase = Restangular.all(URLS.environment.genesis_local);
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
