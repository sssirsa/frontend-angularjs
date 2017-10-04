(function () {
    'use strict';

    angular
        .module('app')
        .factory('SalePointRequests', SalePointRequests);

    function SalePointRequests(Restangular, $window, URLS, EnvironmentConfig) {
        var baseUrl = null;
        switch (EnvironmentConfig.environment) {
            case 'development':
                baseUrl = Restangular.all(URLS.environment.mobile_dev);
                break;
            case 'staging':
                baseUrl = Restangular.all(URLS.environment.mobile_stg);
                break;
            case 'production':
                baseUrl = Restangular.all(URLS.environment.mobile);
                break;
            case 'local':
                baseUrl = Restangular.all(URLS.environment.mobile_local);
                break;
        }

        var service = {
            getByID: getByID,
            getAll: getAll,
            locate: locate
        };

        function getByID(id) {
            return baseUrl.one('atencion_pv', id).customGET();
        }

        function getAll() {
            return baseUrl.all('atencion_pv').getList();
        }

        function locate(latitude, longitude) {
            var url = URLS.geoLocation + latitude + ',' + longitude;
            var target = '_blank';

            $window.open(url, target);
        }

        return service;
    }

})();
