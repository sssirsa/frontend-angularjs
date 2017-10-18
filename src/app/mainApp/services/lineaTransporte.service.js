(function() {
    'use strict';

    angular
        .module('app')
        .factory('LineaTransporte', LineaTransporte);

    /* @ngInject */
    function LineaTransporte(Restangular, EnvironmentConfig, URLS) {

        // var baseModelo = Restangular.all('linea_transporte');
        var baseModelo = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                baseModelo = Restangular.all(URLS.environment.genesis_dev).all('linea_transporte');
                break;
            case 'staging':
                baseModelo = Restangular.all(URLS.environment.genesis_stg).all('linea_transporte');
                break;
            case 'production':
                baseModelo = Restangular.all(URLS.environment.genesis).all('linea_transporte');
                break;
            case 'local':
                baseModelo = Restangular.all(URLS.environment.genesis_local).all('linea_transporte');
                break;
        }

        return {
            list:list,
            update:update,
            create:create,
            get:get,
            remove: remove,
            listObject:listObject
        };
        function listObject() {
            return baseModelo.getList();
        }
        function get(id) {
            return baseModelo.get(id);
        }
        function list(){
            return baseModelo.getList().$object;
        }

        function update(object)
        {
            return baseModelo.all(object.id).customPUT(object);
        }

        function create(object){
            return baseModelo.post(object);
        }

        function remove(object)  {
            return baseModelo.customDELETE(object.id,null,{'content-type':'application/json'});
        }
    }

})();
