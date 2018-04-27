(function () {
    'use strict';

    angular
        .module('app')
        .factory('preRequests', preRequests);

    function preRequests(MobileRestangular, $window, URLS) {
        var baseUrl=MobileRestangular.all(URLS.preRequest);

        var service = {
            getByID: getByID,
            getAll: getAll,
            create:create,
            update:update
        };

        function getByID(id) {
            return baseUrl.all(id).customGET();
        }

        function getAll() {
            return baseUrl.getList();
        }

        function create (element){
            return baseUrl.post(element);
        }
        function update (element){
            return baseUrl.all(element.id).put(element);
        }

        return service;
    }

})();
