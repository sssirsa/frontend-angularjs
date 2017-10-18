(function() {
    'use strict';

    angular
        .module('app')
        .factory('MarcaCabinet', MarcaCabinet);

    /* @ngInject */
    function MarcaCabinet(Restangular, EnvironmentConfig, URLS) {
        // var baseMarca = Restangular.all('marca_cabinet');
        var baseMarca = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                baseMarca = Restangular.all(URLS.environment.genesis_dev).all('marca_cabinet');
                break;
            case 'staging':
                baseMarca = Restangular.all(URLS.environment.genesis_stg).all('marca_cabinet');
                break;
            case 'production':
                baseMarca = Restangular.all(URLS.environment.genesis).all('marca_cabinet');
                break;
            case 'local':
                baseMarca = Restangular.all(URLS.environment.genesis_local).all('marca_cabinet');
                break;
        }

        return {
            list:list,
            update:update,
            remove:remove,
            get: get,
            create:create,
            getModels:getModels,
            listPromise:listPromise,
            listObject:listObject
        };
        function get(id) {
            return baseMarca.get(id);
        }

        function listPromise() {
            return baseMarca.getList();
        }

        function list(){
            return baseMarca.getList().$object;
        }

        function listObject(){
            return baseMarca.getList();
        }

        function update(object)
        {
            return baseMarca.all(object.id).customPUT(object);
        }

        function create(object){
            return baseMarca.post(object);
        }

        function remove(object) {
            return baseMarca.customDELETE(object.id,null,{'content-type':'application/json'});
        }

        function getModels(id){
            return baseMarca.one('models',id).getList();
        }

    }

})();
