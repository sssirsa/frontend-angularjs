/**
 * Created by Luis_Olvera on 19/07/2016.
 */
(function(){
    'use_strict';

    angular
        .module('app.mainApp')
        .factory('udn',udn);
    function udn(Restangular, EnvironmentConfig, URLS){

        //var baseUdn = Restangular.all('udn');
        var baseUdn = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                baseUdn = Restangular.all(URLS.environment.genesis_dev).all('udn');
                break;
            case 'staging':
                baseUdn = Restangular.all(URLS.environment.genesis_stg).all('udn');
                break;
            case 'production':
                baseUdn = Restangular.all(URLS.environment.genesis).all('udn');
                break;
            case 'local':
                baseUdn = Restangular.all(URLS.environment.genesis_local).all('udn');
                break;
        }

        return {
            list:list,
            update:update,
            create:create,
            remove:remove,
            listObject:listObject,
            getOne: getOne
        };
        function listObject() {
            return baseUdn.getList();
        }
        function getOne(id) {
            return baseUdn.get(id);
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
