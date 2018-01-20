(function () {
    'use strict';

    angular
        .module('app')
        .factory('Etapa', Etapa);

    /* @ngInject */
    function Etapa(WebRestangular, URLS) {
        var baseUrl = WebRestangular.all(URLS.etapa);

        return {
            list:list,
            update:update,
            create:create,
            remove:remove
        };
        function list(){
            return baseUrl.getList();
        }

        function update(object)
        {
            return baseUrl.all(object.id).customPUT(object);
        }

        function create(object){
            return baseUrl.post(object);
        }

        function remove(object) {
            return baseUrl.customDELETE(object.id,null,{'content-type':'application/json'});
        }

    }
})();
