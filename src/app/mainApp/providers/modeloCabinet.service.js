(function() {
    'use strict';

    angular
        .module('app')
        .factory('ModeloCabinet', ModeloCabinet);

    /* @ngInject */
    function ModeloCabinet(WebRestangular, URLS) {
        var baseModelo = WebRestangular.all(URLS.modelo_cabinet);

        return {
            list:list,
            update:update,
            create:create,
            get:get,
            remove: remove,
            marca:marca,
            listWitout:listWitout
        };

        function listWitout(limit, offset){
            if(limit !== undefined  && offset !== undefined ) {
                return WebRestangular.all(URLS.modelo_cabinet+'?limit='+limit+'&offset='+offset).customGET();
            } else {
                return baseModelo.customGET();
            }
        }
        function get(id) {
            return baseModelo.get(id);
        }
        function list(){
            return baseModelo.getList().$object;
        }

        function update(object)
        {
            return baseModelo.all(object.id).customPUT(object);
        }

        function create(object){
            return baseModelo.post(object);
        }

        function remove(object)  {
            return baseModelo.customDELETE(object.id,null,{'content-type':'application/json'});
        }

        function marca(id){
            return baseModelo.one('marca',id).customGET();
        }
    }

})();
