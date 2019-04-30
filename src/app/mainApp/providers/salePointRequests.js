(function () {
    'use strict';

    angular
        .module('app')
        .factory('SalePointRequests', SalePointRequests);

    function SalePointRequests(
        API,
        $window,
        URLS
    ) {
        var baseUrl = API.all(URLS.salepoint.base).all(URLS.salepoint.requests);

        var service = {
            getByID: getByID,
            getAll: getAll,
            locate: locate,
            create: create,
            report: report
        };

        function getByID(id) {
            return baseUrl.all("all").all(id).customGET();
        }

        function getAll(limit, offset, filter) {
            if (angular.isUndefined(filter)) {
                return API.all(URLS.salepoint.base).all(URLS.salepoint.requests + '/all' + '?limit=' + limit + '&offset=' + offset).customGET();
            }
            else {
                return API.all(URLS.salepoint.base).all(URLS.salepoint.requests + '/all' + '?limit=' + limit + '&offset=' + offset + '&' + filter).customGET();
            }
        }

        function locate(latitude, longitude) {
            var url = URLS.geoLocation + latitude + ',' + longitude;
            var target = '_blank';

            $window.open(url, target);
        }

        //TODO: Make the proper handling for each of the different request types
        function create(element) {
            return baseUrl.post(element);
        }

        function report(id){
            return baseUrl.one('report',id).get();
        }

        return service;
    }

})();
