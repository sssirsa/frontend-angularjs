(function() {
    'use strict';

    angular
        .module('app')
        .factory('MarcaCabinet', MarcaCabinet);

    /* @ngInject */
    function MarcaCabinet(WebRestangular, URLS) {
        var baseMarca = WebRestangular.all(URLS.marca);

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

        function listPromise(limit, offset) {
            if(limit !== undefined && offset !== undefined ) {
                return WebRestangular.all(URLS.marca + '?limit=' + limit + '&offset=' + offset).customGET();
            } else {
                return baseMarca.customGET();
            }
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
