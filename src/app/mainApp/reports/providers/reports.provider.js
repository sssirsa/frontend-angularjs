(function () {
    'use strict';

    angular
        .module('app.mainApp')
        .factory('REPORT', ReportProvider);

    function ReportProvider(
        API,
        $window,
        URLS
    ) {
        var baseUrl = API.all(URLS.reports.base).all(URLS.reports.report.base);

        var service = {
            getHistoricalByID: getHistoricalByID,
            listHistoricalReports: listHistoricalReports
            /*create_new_request: create_new_request,
            create_incremental_request: create_incremental_request,
            create_change_request: create_change_request,
            create_retrieve_request: create_retrieve_request,
            create_technical_service_request: create_technical_service_request*/
        };

        function getHistoricalByID(id) {
            return baseUrl.all(URLS.reports.historical.base).all(id).customGET();
        }

        function listHistoricalReports(limit, offset, filter) {
            var preUrl = URLS.reports.report.historical.base
                + '?limit=' + limit
                + '&offset=' + offset;
            if (angular.isUndefined(filter)) {
                return baseUrl.all(preUrl).customGET();
            }
            else {
                return baseUrl.all(preUrl + '&' + filter).customGET();
            }
        }
        /*
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
        }*/

        return service;
    }

})();
