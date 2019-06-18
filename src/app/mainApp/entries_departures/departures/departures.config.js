(function () {
    angular
        .module('app.mainApp.entries_departures.departures')
        .config(entriesConfig);

    function entriesConfig($translatePartialLoaderProvider, $stateProvider, triMenuProvider) {
        $translatePartialLoaderProvider.addPart('app/mainApp/entries_departures/departures');
        $stateProvider
            /* New asset departures */
            .state('triangular.admin-default.departure-new-manual', {
                url: '/salida/nuevos/manual',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
                    }
                },
                templateUrl: 'app/mainApp/entries_departures/departures/new/manual/newManualDeparture.tmpl.html',
                controller: 'newManualDepartureController',
                controllerAs: 'vm'
            })
            /* Obsolete asset departures */
            .state('triangular.admin-default.departure-obsolete-manual', {
                url: '/salida/obsoletos/manual',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
                    }
                },
                templateUrl: 'app/mainApp/entries_departures/departures/obsolete/manual/obsoleteManualDeparture.tmpl.html',
                controller: 'obsoleteManualDepartureController',
                controllerAs: 'vm'
            })
            /* Warehouse asset departures */
            .state('triangular.admin-default.departure-warehouse-manual', {
                url: '/salida/almacen/manual',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
                    }
                },
                templateUrl: 'app/mainApp/entries_departures/departures/warehouse/manual/warehouseManualDeparture.tmpl.html',
                controller: 'warehouseManualDepartureController',
                controllerAs: 'vm'
            })
            ;
        triMenuProvider.addMenu(
            {
                name: 'DEPARTURES.MENU.TITLE',
                icon: 'fa fa-sign-out-alt',
                type: 'dropdown',
                permission_old: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN'],
                priority: 5,
                children: [
                    {
                        name: 'DEPARTURES.MENU.NEW',
                        type: 'link',
                        permission: ['ADMINISTRADOR', 'TECNICO A', 'TULTITLAN'],
                        state: 'triangular.admin-default.departure-new-manual'
                    },
                    {
                        name: 'DEPARTURES.MENU.OBSOLETE',
                        type: 'link',
                        permission: ['ADMINISTRADOR', 'TECNICO A', 'TULTITLAN'],
                        state: 'triangular.admin-default.departure-obsolete-manual'
                    },
                    {
                        name: 'DEPARTURES.MENU.WAREHOUSE',
                        type: 'link',
                        permission: ['ADMINISTRADOR', 'TECNICO C', 'TULTITLAN'],
                        state: 'triangular.admin-default.departure-warehouse-manual'
                    }
                ]

            }
        );
    }
})();
