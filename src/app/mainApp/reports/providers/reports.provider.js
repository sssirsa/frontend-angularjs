(function () {
    'use strict';

    angular
        .module('app.mainApp.reports')
        .factory('REPORT', ReportProvider);

    function ReportProvider(
        API,
        URLS
    ) {
        var baseUrl = API.all(URLS.reports.base).all(URLS.reports.report.base);

        var service = {
            getHistoricalByID: getHistoricalByID,
            listHistoricalReports: listHistoricalReports
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

        return service;
    }

})();
