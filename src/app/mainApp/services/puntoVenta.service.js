/**
 * Created by franciscojaviercerdamartinez on 11/11/16.
 */
(function () {
    'use_strict';

    angular
        .module('app.mainApp.servicios')
        .factory('PuntoDeVenta', PuntoDeVenta);

    function PuntoDeVenta(Restangular, EnvironmentConfig, URLS) {
        // var baseURL = Restangular.all('servicio_punto_venta');

        var baseURL = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                baseURL = Restangular.all(URLS.environment.genesis_dev).all('servicio_punto_venta');
                break;
            case 'staging':
                baseURL = Restangular.all(URLS.environment.genesis_stg).all('servicio_punto_venta');
                break;
            case 'production':
                baseURL = Restangular.all(URLS.environment.genesis).all('servicio_punto_venta');
                break;
            case 'local':
                baseURL = Restangular.all(URLS.environment.genesis_local).all('servicio_punto_venta');
                break;
        }

        var service = {
            list: list,
            getById: getById,
            getClosed:getClosed,
            getOpen:getOpen,
            modify: modify,
            create: create,
            remove: remove,
            listObject: listObject
        };

        function getById(id) {
            return baseURL.all(id).customGET();
        }

        function getClosed(){
            return baseURL.all('cerrado').getList().$object;
        }

        function getOpen(){
            return baseURL.all('abierto').getList().$object;
        }

        function listObject() {
            return baseURL.getList();
        }

        function list() {
            return baseURL.getList().$object;
        }

        function modify(object) {
            return baseURL.all(object.id).customPUT(object);
        }

        function create(object) {
            return baseURL.post(object);
        }

        function remove(object) {
            return baseURL.customDELETE(object.id, null, {'content-type': 'application/json'});
        }

        return service;
    }

})();
