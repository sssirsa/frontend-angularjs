(function () {
    angular
        .module('app.mainApp.entries_departures.entries')
        .config(entriesConfig);

    function entriesConfig($translatePartialLoaderProvider, $stateProvider, triMenuProvider) {
        $translatePartialLoaderProvider.addPart('app/mainApp/entries_departures/entries');
        $stateProvider
            /* New asset entries */
            .state('triangular.admin-default.entry-new-manual', {
                url: '/entrada/nuevos/manual',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
                    }
                },
                templateUrl: 'app/mainApp/entries_departures/entries/new/manual/newManualEntry.tmpl.html',
                controller: 'newManualEntryController',
                controllerAs: 'vm'
            })
            /* Warranty asset entries */
            .state('triangular.admin-default.entry-warranty-manual', {
                url: '/entrada/garantias/manual',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
                    }
                },
                templateUrl: 'app/mainApp/entries_departures/entries/warranty/manual/warrantyManualEntry.tmpl.html',
                controller: 'warrantyManualEntryController',
                controllerAs: 'vm'
            })
            /* Unrecognizable asset entries */
            .state('triangular.admin-default.entry-unrecognizable-manual', {
                url: '/entrada/no_capitalizados/manual',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
                    }
                },
                templateUrl: 'app/mainApp/entries_departures/entries/unrecognizable/manual/unrecognizableManualEntry.tmpl.html',
                controller: 'unrecognizableManualEntryController',
                controllerAs: 'vm'
            })
            /* Warehouse asset entries */
            .state('triangular.admin-default.entry-warehouse-manual', {
                url: '/entrada/almacen/manual',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
                    }
                },
                templateUrl: 'app/mainApp/entries_departures/entries/warehouse/manual/warehouseManualEntry.tmpl.html',
                controller: 'warehouseManualEntryController',
                controllerAs: 'vm'
            })
            ;
        triMenuProvider.addMenu(
            {
                name: 'ENTRIES.MENU.TITLE',
                icon: 'fa fa-sign-in-alt',
                type: 'dropdown',
                permission: ['ADMINISTRADOR', 'TECNICO A','TECNICO C', 'TULTITLAN'],
                priority: 4,
                children: [
                    {
                        name: 'ENTRIES.MENU.NEW',
                        type: 'link',
                        permission: ['ADMINISTRADOR', 'TECNICO A', 'TULTITLAN'],
                        state: 'triangular.admin-default.entry-new-manual'
                    },
                    {
                        name: 'ENTRIES.MENU.WARRANTIES',
                        type: 'link',
                        permission: ['ADMINISTRADOR', 'TECNICO A', 'TULTITLAN'],
                        state: 'triangular.admin-default.entry-warranty-manual'
                    },
                    {
                        name: 'ENTRIES.MENU.UNRECOGNIZABLE',
                        type: 'link',
                        permission: ['ADMINISTRADOR', 'TECNICO A', 'TULTITLAN'],
                        state: 'triangular.admin-default.entry-unrecognizable-manual'
                    },
                    {
                        name: 'ENTRIES.MENU.WAREHOUSE',
                        type: 'link',
                        permission: ['ADMINISTRADOR', 'TECNICO C', 'TULTITLAN'],
                        state: 'triangular.admin-default.entry-warehouse-manual'
                    }
                ]

            }
        );
    }
})();
