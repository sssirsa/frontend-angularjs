/**
 * Created by lockonDaniel on 9/8/16.
 */
(function () {
    'use strict';

    angular
        .module('app.mainApp')
        .factory('TipoTransporte',TipoTransporte);

    function TipoTransporte(Restangular, EnvironmentConfig, URLS)
    {
        //var baseTipoTransporte = Restangular.all('tipo_transporte');
        var baseTipoTransporte = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                baseTipoTransporte = Restangular.all(URLS.environment.genesis_dev).all('tipo_transporte');
                break;
            case 'staging':
                baseTipoTransporte = Restangular.all(URLS.environment.genesis_stg).all('tipo_transporte');
                break;
            case 'production':
                baseTipoTransporte = Restangular.all(URLS.environment.genesis).all('tipo_transporte');
                break;
            case 'local':
                baseTipoTransporte = Restangular.all(URLS.environment.genesis_local).all('tipo_transporte');
                break;
        }

        var service = {
            list:list,
            update:update,
            create:create,
            remove:remove,
            listObject:listObject
        };
        function listObject() {
            return baseTipoTransporte.getList();
        }


        function list(){
            return baseTipoTransporte.getList().$object;
        }

        function update(object)
        {
            return object.put();
        }

        function create(object){
            return baseTipoTransporte.post(object);
        }

        function remove(object) {
            return baseTipoTransporte.customDELETE(object.id,null,{'content-type':'application/json'});
        }






        return service;
    }

})();
