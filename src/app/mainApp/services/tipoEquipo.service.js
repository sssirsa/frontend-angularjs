/**
 * Created by Luis_Olvera on 19/07/2016.
 */
(function(){
    'use_strict';

    angular
        .module('app.mainApp')
        .factory('TipoEquipo',TipoEquipo);

    function TipoEquipo(Restangular, Environmentconfig, URLS){
        // var baseURL=Restangular.all('tipo_equipo');
        var baseURL = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                baseURL = Restangular.all(URLS.environment.genesis_dev).all('tipo_equipo');
                break;
            case 'staging':
                baseURL = Restangular.all(URLS.environment.genesis_stg).all('tipo_equipo');
                break;
            case 'production':
                baseURL = Restangular.all(URLS.environment.genesis).all('tipo_equipo');
                break;
            case 'local':
                baseURL = Restangular.all(URLS.environment.genesis_local).all('tipo_equipo');
                break;
        }
        return {
            list: list,
            update: update,
            create: create,
            remove: remove,
            listWitout:listWitout
        };



        function list(){
            return baseURL.getList().$object;
        }
        function listWitout(){
            return baseURL.getList();
        }

        function update(object){
            return baseURL.all(object.id).customPUT(object);
        }

        function create(object){
            return baseURL.post(object);
        }

        function remove(object){
            return baseURL.customDELETE(object.id,null,{'content-type':'application/json'});
        }

    }
})();
