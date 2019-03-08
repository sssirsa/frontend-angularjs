(function () {
    'use strict';

    angular
        .module('app.mainApp')
        .factory('preRequests', preRequests);

    function preRequests(
        API,
        $window,
        URLS) {
        var baseUrl=API.all(URLS.external_service.base).all(URLS.preRequest.base);
        //var baseUrl=API.all(URLS.mobile.base).all(URLS.preRequest);
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

        function getAll(limit, offset, filter) {
            if (filter === undefined) {
                return API.all(URLS.mobile.base).all(URLS.preRequest + '?limit=' + limit + '&offset=' + offset).customGET();
            }
            else {
                return API.all(URLS.mobile.base).all(URLS.preRequest + '?limit=' + limit + '&offset=' + offset+'&'+filter).customGET();
            }
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
