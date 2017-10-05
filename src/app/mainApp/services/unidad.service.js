/**
 * Created by amezc on 01/12/2016.
 */

(function(){
    'use_strict';

    angular
        .module('app.mainApp')
        .factory('unidad',unidad);
    function unidad(Restangular, EnvironmentConfig, URLS){

        // var baseUdn = Restangular.all('unidad');
        var baseUdn = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                baseUdn = Restangular.all(URLS.environment.genesis_dev).all('unidad');
                break;
            case 'staging':
                baseUdn = Restangular.all(URLS.environment.genesis_stg).all('unidad');
                break;
            case 'production':
                baseUdn = Restangular.all(URLS.environment.genesis).all('unidad');
                break;
            case 'local':
                baseUdn = Restangular.all(URLS.environment.genesis_local).all('unidad');
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
            return baseUdn.getList();
        }

        function list(){
            return baseUdn.getList().$object;
        }

        function update(object)
        {
            return baseUdn.all(object.id).customPUT(object);
        }

        function create(object){
            return baseUdn.post(object);
        }

        function remove(object) {
            return baseUdn.customDELETE(object.id,null,{'content-type':'application/json'});
        }
    }
})();

