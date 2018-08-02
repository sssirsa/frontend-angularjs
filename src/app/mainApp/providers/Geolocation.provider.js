(function () {
    'use strict';

    angular
        .module('app')
        .factory('Geolocation', GeolocationProvider);

    function GeolocationProvider($window, URLS, KEYS, $http) {

        var service = {
            locate: locate,
            getMap: getMap
        };

        function locate(latitude, longitude) {
            var url = URLS.geoLocation + latitude + ',' + longitude;
            var target = '_blank';

            $window.open(url, target);
        }

        function getMap(latitude, longitude) {
            return $http({
                method:'GET',
                url:URLS.map +
                '?center=' + latitude + ',' + longitude +
                '&zoom=15&size=500x300' +
                '&maptype=roadmap' +
                '&markers=color:red|' + latitude + ',' + longitude +
                '&key=' + KEYS.MAPS_KEY,
                responseType:'arraybuffer'
            });
        }

        return service;
    }

})();
