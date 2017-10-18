/**
 * Created by Emmanuel on 11/09/2016.
 */
(function () {
    'use_strict';

    angular
        .module('app.mainApp.catalogos')
        .factory('Proyectos', Proyectos);

    function Proyectos(Restangular, EnvironmentConfig, URLS) {
        // var baseURL=Restangular.all('proyecto');

        var baseURL = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                baseURL = Restangular.all(URLS.environment.genesis_dev).all('proyecto');
                break;
            case 'staging':
                baseURL = Restangular.all(URLS.environment.genesis_stg).all('proyecto');
                break;
            case 'production':
                baseURL = Restangular.all(URLS.environment.genesis).all('proyecto');
                break;
            case 'local':
                baseURL = Restangular.all(URLS.environment.genesis_local).all('proyecto');
                break;
        }

        var service = {
            list: list,
            modify: modify,
            create: create,
            remove: remove,
            listObject:listObject
        };

        function listObject() {
            return baseURL.getList();
        }

        function list(){
            return baseURL.getList().$object;
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

        return service;
    }

})();
