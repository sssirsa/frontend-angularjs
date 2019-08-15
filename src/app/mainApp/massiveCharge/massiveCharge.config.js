/**
 * Created by franciscojaviercerdamartinez on 7/16/19.
 */
(function () {
    'use strict';
    angular
        .module('app.mainApp.massiveCharge')
        .config(moduleConfig);

    function moduleConfig(
        $stateProvider,
        $translatePartialLoaderProvider,
        triMenuProvider
    ) {
        $translatePartialLoaderProvider.addPart('app/mainApp/massiveCharge');
        $stateProvider
            .state('triangular.admin-default.massive-charge-historical', {
                url: '/cargasMasivas/historial',
                data: {
                    permissions: {
                        only: ['inventory__asset__unique_asset_process']
                    }
                },
                templateUrl: 'app/mainApp/massiveCharge/historical/historical.tmpl.html',
                controller: 'HistoricalController',
                controllerAs: 'vm'
            });

        triMenuProvider.addMenu(
            {
                name: 'MAIN.MENU.MASSIVE_CHARGE.TITLE',
                icon: 'fa fa-archive',
                type: 'dropdown',
                permission: [
                    'management__inventory__cabinet',
                    'management__inventory__no_labeled',
                    'management__inventory__asset_location',
                    'inventory__management__bulk_asset_branch',
                    'inventory__management__unique_asset_branch',
                    'inventory__asset__bulk_asset_process',
                    'inventory__asset__unique_asset_process'
                ],
                priority: 9,
                children: [
                    {
                        name: 'MAIN.MENU.MASSIVE_CHARGE.HISTORICAL',
                        state: 'triangular.admin-default.massive-charge-historical',
                        permission: [
                            'entries_departures__inspections__preliminary_inspection'],
                        type: 'link'
                    }
                ]
            });



    }

})();

