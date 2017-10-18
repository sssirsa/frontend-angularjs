/**
 * Created by lockonDaniel on 9/8/16.
 */
(function () {
    'use strict';

    angular
        .module('app.mainApp')
        .factory('Categoria',Categoria);

    function Categoria(Restangular, EnvironmentConfig, URLS){
        //var baseCategoria = Restangular.all('categoria');
        var baseCategoria = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                baseCategoria = Restangular.all(URLS.environment.genesis_dev).all('categoria');
                break;
            case 'staging':
                baseCategoria = Restangular.all(URLS.environment.genesis_stg).all('categoria');
                break;
            case 'production':
                baseCategoria = Restangular.all(URLS.environment.genesis).all('categoria');
                break;
            case 'local':
                baseCategoria = Restangular.all(URLS.environment.genesis_local).all('categoria');
                break;
        }

        var service = {
            list:list,
            listObject:listObject,
            update:update,
            create:create,
            remove:remove
        };
        function listObject() {
            return baseCategoria.getList();
        }

        function list(){
            return baseCategoria.getList().$object;
        }

        function update(object)
        {
            return object.put();
        }

        function create(object){
            return baseCategoria.post(object);
        }

        function remove(object) {
            return baseCategoria.customDELETE(object.id,null,{'content-type':'application/json'});
        }

        return service;
    }

})();
