(function () {
    'use strict';

    angular
        .module('app')
        .factory('SalePointRequests', SalePointRequests);

    function SalePointRequests(MobileRestangular, $window, URLS) {
        var baseUrl=MobileRestangular.all(URLS.solicitud_pv);

        var service = {
            getByID: getByID,
            getAll: getAll,
            locate: locate,
            create:create
        };

        function getByID(id) {
            return baseUrl.all(id).customGET();
        }

        function getAll(limit, offset, filter) {
            if (filter === undefined) {
                return MobileRestangular.all(URLS.solicitud_pv + '?limit=' + limit + '&offset=' + offset).customGET();
            }
            else {
                return MobileRestangular.all(URLS.solicitud_pv + '?limit=' + limit + '&offset=' + offset+'&'+filter).customGET();
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

        return service;
    }

})();
