/**
 * Created by franciscojaviercerdamartinez on 11/11/16.
 */
(function () {
    'use_strict';

    angular
        .module('app.mainApp.tecnico')
        .factory('PuntoDeVenta', PuntoDeVenta);

    function PuntoDeVenta(Restangular) {
        var baseURL = Restangular.all('servicio_punto_venta');

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
            return baseURL.all(id).get();
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
