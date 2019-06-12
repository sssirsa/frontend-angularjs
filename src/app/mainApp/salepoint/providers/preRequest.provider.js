(function () {
    'use strict';

    angular
        .module('app.mainApp.salepoint')
        .factory('PREREQUESTS', preRequestsProvider);

    function preRequestsProvider(
        API,
        URLS,
        _
    ) {
        var preRequestBaseUrl = API
            .all(URLS.salepoint.base)
            .all(URLS.salepoint.pre_request.base);

        function listPreRequests(limit, offset, filter) {
            var params = {limit: limit, offset: offset};
            if (angular.isDefined(filter)) {
                params = _.extend(params, filter);
            }
            return preRequestBaseUrl
                .customGET(URLS.salepoint.pre_request.pre_request, params);
        }

        function getPreRequestByID(preRequestID) {
            return preRequestBaseUrl
                .all(URLS.salepoint.pre_request.pre_request)
                .customGET(preRequestID);
        }

        function createRequest (preRequestData){
            return preRequestBaseUrl
                .all(URLS.salepoint.pre_request.new_request)
                .post(preRequestData);
        }

        function updatePreRequest(preRequestID, preRequestData) {
            return preRequestBaseUrl
                .all(URLS.salepoint.pre_request.pre_request)
                .all(preRequestID)
                .customPUT(preRequestData);
        }

        return {
            getPreRequestByID: getPreRequestByID,
            listPreRequests: listPreRequests,
            createRequest: createRequest,
            updatePreRequest: updatePreRequest
        };
    }

})();
