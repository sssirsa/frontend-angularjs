/**
 * Created by Christian on 11/09/2016.
 */

(function () {
    'use strict';

    angular
        .module('app.mainApp')
        .factory('Sucursal',Sucursal);

    function Sucursal(Restangular, EnvironmentConfig, URLS)
    {
        // var baseSucursal = Restangular.all('sucursal');

        var baseSucursal = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                baseSucursal = Restangular.all(URLS.environment.genesis_dev).all('sucursal');
                break;
            case 'staging':
                baseSucursal = Restangular.all(URLS.environment.genesis_stg).all('sucursal');
                break;
            case 'production':
                baseSucursal = Restangular.all(URLS.environment.genesis).all('sucursal');
                break;
            case 'local':
                baseSucursal = Restangular.all(URLS.environment.genesis_local).all('sucursal');
                break;
        }

        return {
            list:list,
            update:update,
            create:create,
            remove:remove,
            listObject:listObject
        };
        function listObject() {
            return baseSucursal.getList();
        }


        function list(){
            return baseSucursal.getList().$object;
        }

        function update(object)
        {
            return baseSucursal.all(object.id).customPUT(object);
        }

        function create(object){
            return baseSucursal.post(object);
        }

        function remove(object) {
            return baseSucursal.customDELETE(object.id,null,{'content-type':'application/json'});
        }
    }

})();
