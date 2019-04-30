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
        SALEPOINT,
        TECHNICAL_SERVICE,
        EXTERNAL_SERVICE,
        URLS,
        $provide
    ) {
        URLS.entries_departures = ENTRIES_DEPARTURES;
        URLS.inventory = INVENTORY;
        URLS.management = MANAGEMENT;
        URLS.salepoint = SALEPOINT;
        URLS.technical_service = TECHNICAL_SERVICE;
        URLS.external_service = EXTERNAL_SERVICE;

        $provide.constant('URLS', URLS);
    }

})();
