(function () {
    'use strict';

    angular
        .module('app.mainApp')
        .config(mainAppConfig);

    /* @ngInject */
    function mainAppConfig(
        COM,
        ENTRIES_DEPARTURES,
        INVENTORY,
        MANAGEMENT,
        SALEPOINT,
        TECHNICAL_SERVICE,
        REPORTS,
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
        URLS.com = COM;
        URLS.reports = REPORTS;

        $provide.constant('URLS', URLS);
        moment.locale('es', CONFIGS.moment);
    }

})();
