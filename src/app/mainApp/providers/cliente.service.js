/**
 * Created by Emmanuel on 12/09/2016.
 */
/**
 * Created by Emmanuel on 11/09/2016.
 */
(function () {
    'use_strict';

    angular
        .module('app.mainApp.management.catalogues')
        .factory('Clientes', Clientes);

    function Clientes(WebRestangular, URLS) {
        var service = {
            list: list,
            listObject: listObject,
            modify: modify,
            create: create,
            remove: remove,
            getClienteId: getClienteId
        };

        var baseURL=WebRestangular.all(URLS.cliente);

        function list(){
            return baseURL.getList().$object;
        }
        function listObject(){
            return baseURL.getList();
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

        function getClienteId(){
            return WebRestangular.all(URLS.cliente_grupos).customGET();
        }

        return service;
    }

})();