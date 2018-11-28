/**
 * Created by lockonDaniel on 9/8/16.
 */
(function () {
    'use strict';

    angular
        .module('app.mainApp')
        .factory('TipoTransporte',TipoTransporte);

    function TipoTransporte(
        API,
        URLS
    ){
        //var baseTipoTransporte = Restangular.all('tipo_transporte');
        var baseTipoTransporte = API.all(URLS.genesis.base).all(URLS.tipo_transporte);

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
