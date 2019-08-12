/**
 * Created by franciscojaviercerdamartinez on 7/16/19.
 */
(function () {
    angular
        .module('app.mainApp.massiveCharge')
        .constant('MASSIVE_CHARGE', {
            base: 'bulk-manager',
            actions: {
                bulk: 'bulk',
                bulk_load_history:'bulk-load-history'
            }
        });
})();
