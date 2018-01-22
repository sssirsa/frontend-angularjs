(function () {
    'use strict';

    angular
        .module('app')
        .factory('SalePointRequests', SalePointRequests);

    function SalePointRequests(MobileRestangular, $window, URLS) {
        var baseUrl=MobileRestangular;

        var service = {
            getByID: getByID,
            getAll: getAll,
            locate: locate
        };

        function getByID(id) {
            return baseUrl.one(URLS.solicitud_pv, id).customGET();
        }

        function getAll() {
            return baseUrl.all(URLS.solicitud_pv).getList();
        }

        function locate(latitude, longitude) {
            var url = URLS.geoLocation + latitude + ',' + longitude;
            var target = '_blank';

            $window.open(url, target);
        }

        return service;
    }

})();
