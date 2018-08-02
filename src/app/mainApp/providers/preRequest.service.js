(function () {
    'use strict';

    angular
        .module('app.mainApp')
        .factory('preRequests', preRequests);

    function preRequests(MobileRestangular, $window, URLS) {
        var baseUrl=MobileRestangular.all(URLS.preRequest);
        var service = {
            getByID: getByID,
            getAll: getAll,
            create:create,
            createRequest:createRequest,
            update:update
        };

        function getByID(id) {
            return baseUrl.all(id).customGET();
        }

        function getAll() {
            return baseUrl.getList();
        }

        function createRequest (element){
            return baseUrl.all('solicitud').post(element);
        }
        function create (element){
            return baseUrl.post(element);
        }
        function update(element) {
            return baseUrl.all(element.id).customPUT(element);
        }

        return service;
    }

})();
