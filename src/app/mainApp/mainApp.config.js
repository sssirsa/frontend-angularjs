(function () {
    'use strict';

    angular
        .module('app.mainApp')
        .config(mainAppConfig);

    /* @ngInject */
    function mainAppConfig(
        ENTRIES_DEPARTURES,
        INVENTORY,
        MANAGEMENT,
        TECHNICAL_SERVICE,
        URLS,
        $provide
    ) {
        URLS.entries_departures = ENTRIES_DEPARTURES;
        URLS.inventory = INVENTORY;
        URLS.management = MANAGEMENT;
        URLS.technical_service = TECHNICAL_SERVICE;

        $provide.constant('URLS', URLS);
    }

})();
