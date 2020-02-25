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
        REPORTS,
        WAREHOUSE,
        URLS,
        $provide,
        moment,
        CONFIGS
    ) {
        URLS.entries_departures = ENTRIES_DEPARTURES;
        URLS.inventory = INVENTORY;
        URLS.management = MANAGEMENT;
        URLS.salepoint = SALEPOINT;
        URLS.technical_service = TECHNICAL_SERVICE;
        URLS.reports = REPORTS;
        URLS.warehouse = WAREHOUSE;

        $provide.constant('URLS', URLS);
        moment.locale('es', CONFIGS.moment);
    }

})();
