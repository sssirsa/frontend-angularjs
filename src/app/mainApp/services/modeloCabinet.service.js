(function() {
    'use strict';

    angular
        .module('app')
        .factory('ModeloCabinet', ModeloCabinet);

    /* @ngInject */
    function ModeloCabinet(Restangular, EnvironmentConfig, URLS) {
        // var baseModelo = Restangular.all('modelo_cabinet');
        var baseModelo = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                baseModelo = Restangular.all(URLS.environment.genesis_dev).all('modelo_cabinet');
                break;
            case 'staging':
                baseModelo = Restangular.all(URLS.environment.genesis_stg).all('modelo_cabinet');
                break;
            case 'production':
                baseModelo = Restangular.all(URLS.environment.genesis).all('modelo_cabinet');
                break;
            case 'local':
                baseModelo = Restangular.all(URLS.environment.genesis_local).all('modelo_cabinet');
                break;
        }

        return {
            list:list,
            update:update,
            create:create,
            get:get,
            remove: remove,
            marca:marca,
            listWitout:listWitout
        };
        function listWitout(){
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

        function marca(id){
            return Restangular.one('modelo_cabinet').one('marca',id).customGET();
        }
    }

})();
