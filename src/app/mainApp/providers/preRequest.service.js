(function () {
    'use strict';

    angular
        .module('app.mainApp')
        .factory('preRequests', preRequests);

    function preRequests(
        API,
        $window,
        URLS) {
        var baseUrl=API.all(URLS.salepoint.base).all(URLS.salepoint.preRequest);
        var service = {
            getByID: getByID,
            getAll: getAll,
            createRequest:createRequest,
            update:update
        };

        function getByID(id) {
            return baseUrl.all(URLS.external_service.pre_request.pre_request).all(id).customGET();
        }

        function getAll(limit, offset, filter) {
            if (angular.isUndefined(filter)) {
                return API.all(URLS.salepoint.base).all(URLS.salepoint.preRequest + '?limit=' + limit + '&offset=' + offset).customGET();
            }
            else {
                return API.all(URLS.salepoint.base).all(URLS.salepoint.preRequest + '?limit=' + limit + '&offset=' + offset+'&'+filter).customGET();
            }
        }

        function createRequest (element){
            return baseUrl.all(URLS.external_service.pre_request.new_request).post(element);
        }

        function update(element) {
            return baseUrl.all(URLS.external_service.pre_request.pre_request).all(element.id).customPUT(element);
        }

        return service;
    }

})();
