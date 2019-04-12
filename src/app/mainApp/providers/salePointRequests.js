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
        var baseUrl = API.all(URLS.external_service.base).all(URLS.external_service.request.base);

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
            if (filter === undefined) {
                return API.all(URLS.external_service.base).all(URLS.external_service.request.base).all(URLS.external_service.request.list + '?limit=' + limit + '&offset=' + offset).customGET();
            }
            else {
                return API.all(URLS.external_service.base).all(URLS.external_service.request.base).all(URLS.external_service.request.list + '?limit=' + limit + '&offset=' + offset+'&'+filter).customGET();
            }
        }

        function locate(latitude, longitude) {
            var url = URLS.geoLocation + latitude + ',' + longitude;
            var target = '_blank';

            $window.open(url, target);
        }

        function create (element){
            return baseUrl.post(element);
        }

        function report(id){
            return baseUrl.one('report',id).get();
        }

        return service;
    }

})();
