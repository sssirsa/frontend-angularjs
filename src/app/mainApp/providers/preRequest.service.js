(function () {
    'use strict';

    angular
        .module('app.mainApp')
        .factory('preRequests', preRequests);

    function preRequests(
        API,
        $window,
        URLS) {
        var baseUrl = API.all(URLS.external_service.base).all(URLS.external_service.pre_request.base);

        var service = {
            getByID: getByID,
            getAll: getAll,
            create:create,
            createRequest:createRequest,
            update:update
        };

        function getByID(id) {
            return baseUrl.all(URLS.external_service.pre_request.pre_request).all(id).customGET();
        }

        function getAll(limit, offset, filter) {
            if (filter === undefined) {
                return baseUrl.all(URLS.external_service.pre_request.pre_request + '?limit=' + limit + '&offset=' + offset).customGET();
            }
            else {
                return baseUrl.all(URLS.external_service.pre_request.pre_request + '?limit=' + limit + '&offset=' + offset+'&'+filter).customGET();
            }
        }

        function createRequest (element){
            return baseUrl.all(URLS.external_service.pre_request.new_request).post(element);
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
