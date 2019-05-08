(function () {
    'use strict';

    angular
        .module('app')
        .factory('REQUESTS', RequestsProvider);

    function RequestsProvider(
        API,
        $window,
        URLS
    ) {
        var baseUrl = API.all(URLS.salepoint.base).all(URLS.salepoint.request.base);

        var service = {
            getRequestByID: getRequestByID,
            listRequests: listRequests,
            create_new_request: create_new_request,
            create_incremental_request: create_incremental_request,
            create_change_request: create_change_request,
            create_retrieve_request: create_retrieve_request,
            create_technical_service_request: create_technical_service_request
        };

        function getRequestByID(id) {
            return baseUrl.all(URLS.salepoint.request.list).all(id).customGET();
        }

        function listRequests(limit, offset, filter) {
            var preUrl = URLS.salepoint.request.list
                + '?limit=' + limit
                + '&offset=' + offset;
            if (angular.isUndefined(filter)) {
                return baseUrl.all(preUrl).customGET();
            }
            else {
                return baseUrl.all(preUrl + '&' + filter).customGET();
            }
        }

        function create_new_request(element) {
            return baseUrl.all(URLS.salepoint.request.new_request).post(element);
        }

        function create_incremental_request(element) {
            return baseUrl.all(URLS.salepoint.request.incremental_request).post(element);
        }

        function create_change_request(element) {
            return baseUrl.all(URLS.salepoint.request.change_request).post(element);
        }

        function create_retrieve_request(element) {
            return baseUrl.all(URLS.salepoint.request.retrieve_request).post(element);
        }

        function create_technical_service_request(element) {
            return baseUrl.all(URLS.salepoint.request.technical_service_request).post(element);
        }

        return service;
    }

})();
