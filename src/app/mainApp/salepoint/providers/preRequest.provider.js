(function () {
    'use strict';

    angular
        .module('app.mainApp')
        .factory('PREREQUESTS', preRequestsProvider);

    function preRequestsProvider(
        API,
        $window,
        URLS
    ) {
        var baseUrl = API.all(URLS.salepoint.base).all(URLS.salepoint.pre_request.base);
        var service = {
            getPreRequestByID: getPreRequestByID,
            listPreRequest: listPreRequest,
            createRequest: createRequest,
            updatePreRequest: updatePreRequest
        };

        function getPreRequestByID(id) {
            return baseUrl.all(URLS.salepoint.pre_request.pre_request).all(id).customGET();
        }

        function listPreRequest(limit, offset, filter) {
            var preUrl = URLS.salepoint.pre_request.pre_request
                + '?limit='
                + limit
                + '&offset='
                + offset
                + '&ordering=fecha';
            if (angular.isUndefined(filter)) {
                return baseUrl.all(preUrl).customGET();
            }
            else {
                return baseUrl.all(preUrl + '&' + filter).customGET();
            }
        }

        function createRequest (element){
            return baseUrl.all(URLS.salepoint.pre_request.new_request).post(element);
        }

        function updatePreRequest(element) {
            return baseUrl.all(URLS.salepoint.pre_request.pre_request).all(element.id).customPUT(element);
        }

        return service;
    }

})();
