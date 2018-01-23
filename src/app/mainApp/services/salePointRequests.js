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

        function getAll() {
            return baseUrl.getList();
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
