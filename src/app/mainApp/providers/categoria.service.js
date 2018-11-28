/**
 * Created by lockonDaniel on 9/8/16.
 */
(function () {
    'use strict';

    angular
        .module('app.mainApp')
        .factory('Categoria',Categoria);

    function Categoria(
        API,
        URLS
    ) {
        var baseCategoria = API.all(URLS.genesis.base).all(URLS.categoria);

        var service = {
            list:list,
            listObject:listObject,
            update:update,
            create:create,
            remove:remove
        };
        function listObject(limit, offset) {
            if (limit !== undefined && offset !== undefined) {
                return API.all(URLS.genesis.base).all(URLS.categoria+'?limit='+limit+'&offset='+offset).customGET();
            }
            else {
                return baseCategoria.getList();
            }

        }

        function list(){
            return baseCategoria.getList().$object;
        }

        function update(object)
        {
            return object.put();
        }

        function create(object){
            return baseCategoria.post(object);
        }

        function remove(object) {
            return baseCategoria.customDELETE(object.id,null,{'content-type':'application/json'});
        }

        return service;
    }

})();
