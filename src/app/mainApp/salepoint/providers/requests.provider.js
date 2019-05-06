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
            getByID: getByID,
            getAll: getAll,
            locate: locate,
            create_new_request: create_new_request,
            create_incremental_request: create_incremental_request,
            create_change_request: create_change_request,
            create_retrieve_request: create_retrieve_request,
            create_technical_service_request: create_technical_service_request
        };

        function getByID(id) {
            return baseUrl.all(URLS.salepoint.request.list).all(id).customGET();
        }

        function getAll(limit, offset, filter) {
            if (angular.isUndefined(filter)) {
                return baseUrl.all(URLS.salepoint.request.list + '?limit=' + limit + '&offset=' + offset).customGET();
            }
            else {
                return baseUrl.all(URLS.salepoint.request.list + '?limit=' + limit + '&offset=' + offset + '&' + filter).customGET();
            }
        }

        function locate(latitude, longitude) {
            var url = URLS.geoLocation + latitude + ',' + longitude;
            var target = '_blank';
            $window.open(url, target);
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
