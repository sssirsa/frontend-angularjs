/**
 * Created by franciscojaviercerdamartinez on 1/7/19.
 */
(function() {
    'use strict';

    angular
        .module('app')
        .factory('assetStoringProvider', assetStoringProvider);

    /* @ngInject */
    function assetStoringProvider(
        $q,
        URLS,
        $http,
        API
    ) {

        var urlbase = API.all(URLS.management.base).all(URLS.management.inventory.base).all(URLS.management.inventory.asset_location);

        return {
            create: create
        };

        function create(data){
            return urlbase.customPOST(data);
        }

    }
})();
