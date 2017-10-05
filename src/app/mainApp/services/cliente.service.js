/**
 * Created by Emmanuel on 12/09/2016.
 */
/**
 * Created by Emmanuel on 11/09/2016.
 */
(function () {
    'use_strict';

    angular
        .module('app.mainApp.catalogos')
        .factory('Clientes', Clientes);

    function Clientes(Restangular, EnvironmentConfig, URLS) {
        var service = {
            list: list,
            listObject: listObject,
            modify: modify,
            create: create,
            remove: remove,
            getClienteId: getClienteId
        };

        //var baseURL=Restangular.all('persona_capturista');
        var baseURL = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                baseURL = Restangular.all(URLS.environment.genesis_dev).all('persona_capturista');
                break;
            case 'staging':
                baseURL = Restangular.all(URLS.environment.genesis_stg).all('persona_capturista');
                break;
            case 'production':
                baseURL = Restangular.all(URLS.environment.genesis).all('persona_capturista');
                break;
            case 'local':
                baseURL = Restangular.all(URLS.environment.genesis_local).all('persona_capturista');
                break;
        }

        function list(){
            return baseURL.getList().$object;
        }
        function listObject(){
            return baseURL.getList();
        }

        function modify(object){
            return baseURL.all(object.id).customPUT(object);
        }

        function create(object){
            return baseURL.post(object);
        }

        function remove(object){
            return baseURL.customDELETE(object.id,null,{'content-type':'application/json'});
        }

        function getClienteId(){
            return Restangular.all('cliente_groups').customGET();
        }

        return service;
    }

})();
