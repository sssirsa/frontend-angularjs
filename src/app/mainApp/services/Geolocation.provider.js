(function () {
    'use strict';

    angular
        .module('app')
        .factory('Geolocation', GeolocationProvider);

    function GeolocationProvider($window, URLS) {

        var service = {
            locate: locate
        };
        function locate(latitude, longitude) {
            var url = URLS.geoLocation + latitude + ',' + longitude;
            var target = '_blank';

            $window.open(url, target);
        }

        return service;
    }

})();
