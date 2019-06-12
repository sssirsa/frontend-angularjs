(function () {
    'use strict';

    angular
        .module('app.mainApp.salepoint')
        .factory('REQUESTS', RequestsProvider);

    function RequestsProvider(
        API,
        URLS,
        _
    ) {
        var RequestBaseUrl = API
            .all(URLS.salepoint.base)
            .all(URLS.salepoint.request.base);

        function listRequests(limit, offset, filter) {
            var params = {limit: limit, offset: offset};
            if (angular.isDefined(filter)) {
                params = _.extend(params, filter);
            }
            return RequestBaseUrl
                .customGET(URLS.salepoint.request.list, params);
        }

        function getRequestByID(requestID) {
            return RequestBaseUrl
                .all(URLS.salepoint.request.list)
                .customGET(requestID);
        }

        function create_new_request(requestData) {
            return RequestBaseUrl
                .all(URLS.salepoint.request.new_request)
                .post(requestData);
        }

        function create_incremental_request(requestData) {
            return RequestBaseUrl
                .all(URLS.salepoint.request.incremental_request)
                .post(requestData);
        }

        function create_change_request(requestData) {
            return RequestBaseUrl
                .all(URLS.salepoint.request.change_request)
                .post(requestData);
        }

        function create_retrieve_request(requestData) {
            return RequestBaseUrl
                .all(URLS.salepoint.request.retrieve_request)
                .post(requestData);
        }

        function create_technical_service_request(requestData) {
            return RequestBaseUrl
                .all(URLS.salepoint.request.technical_service_request)
                .post(requestData);
        }

        return {
            getRequestByID: getRequestByID,
            listRequests: listRequests,
            create_new_request: create_new_request,
            create_incremental_request: create_incremental_request,
            create_change_request: create_change_request,
            create_retrieve_request: create_retrieve_request,
            create_technical_service_request: create_technical_service_request
        };
    }

})();
