(function () {
    'use strict';

    angular
        .module('app')
        .factory('Etapa', Etapa);

    /* @ngInject */
    function Etapa(Restangular, EnvironmentConfig, URLS) {
        // var baseUrl = Restangular.all('etapa');
        var baseUrl = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                baseUrl = Restangular.all(URLS.environment.genesis_dev).all('etapa');
                break;
            case 'staging':
                baseUrl = Restangular.all(URLS.environment.genesis_stg).all('etapa');
                break;
            case 'production':
                baseUrl = Restangular.all(URLS.environment.genesis).all('etapa');
                break;
            case 'local':
                baseUrl = Restangular.all(URLS.environment.genesis_local).all('etapa');
                break;
        }

        return {
            list:list,
            update:update,
            create:create,
            remove:remove
        };
        function list(){
            return baseUrl.getList();
        }

        function update(object)
        {
            return baseUrl.all(object.id).customPUT(object);
        }

        function create(object){
            return baseUrl.post(object);
        }

        function remove(object) {
            return baseUrl.customDELETE(object.id,null,{'content-type':'application/json'});
        }

    }
})();
