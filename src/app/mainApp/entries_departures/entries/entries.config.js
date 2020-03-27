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
                        only: ['entries_departures__entries__new_entries']
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
                        only: ['entries_departures__entries__warranties_entries']
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
                        only: ['entries_departures__entries__no_labeled_entries']
                    }
                },
                templateUrl: 'app/mainApp/entries_departures/entries/unrecognizable/manual/unrecognizableManualEntry.tmpl.html',
                controller: 'unrecognizableManualEntryController',
                controllerAs: 'vm'
            })
            /* Warehouse asset entries */
            .state('triangular.admin-default.entry-warehouse-manual', {
                url: '/entrada/buen_estado/manual',
                data: {
                    permissions: {
                        only: ['entries_departures__entries__warehouse_entries']
                    }
                },
                templateUrl: 'app/mainApp/entries_departures/entries/warehouse/manual/warehouseManualEntry.tmpl.html',
                controller: 'warehouseManualEntryController',
                controllerAs: 'vm'
            })
            /* Salepoint asset entries */
            .state('triangular.admin-default.entry-repair-manual', {
                url: '/entrada/punto_de_venta/manual',
                data: {
                    permissions: {
                        only: ['entries_departures__entries__repair_entries',
                            'entries_departures__entries__salepoint_entries']
                    }
                },
                templateUrl: 'app/mainApp/entries_departures/entries/repair/manual/repairManualEntry.tmpl.html',
                controller: 'repairManualEntryController',
                controllerAs: 'vm'
            })
            /* List entries */
            .state('triangular.admin-default.entries-list', {
                url: '/entrada/listado',
                data: {
                    permissions: {
                        only: ['entries_departures__entries__list_all_entries']
                    }
                },
                templateUrl: 'app/mainApp/entries_departures/entries/list/entriesList.tmpl.html',
                controller: 'entriesListController',
                controllerAs: 'vm'
            })
            /* Entry detail */
            .state('triangular.admin-default.entry-detail', {
                url: '/entrada/detalle/:entryId',
                data: {
                    permissions: {
                        only: ['entries_departures__entries__list_all_entries',
                            'entries_departures__entries__new_entries',
                            'entries_departures__entries__warranties_entries',
                            'entries_departures__entries__no_labeled_entries',
                            'entries_departures__entries__warehouse_entries',
                            'entries_departures__entries__repair_entries',
                            'entries_departures__entries__salepoint_entries']
                    }
                },
                params: {
                    entryId: null,
                    entry: null
                },
                templateUrl: 'app/mainApp/entries_departures/entries/detail/entryDetail.tmpl.html',
                controller: 'entryDetailController',
                controllerAs: 'vm'
            })
            ;
        triMenuProvider.addMenu(
            {
                name: 'ENTRIES.MENU.TITLE',
                icon: 'fa fa-sign-in-alt',
                type: 'dropdown',
                permission: ['entries_departures__entries__list_all_entries',
                    'entries_departures__entries__new_entries',
                    'entries_departures__entries__warranties_entries',
                    'entries_departures__entries__no_labeled_entries',
                    'entries_departures__entries__warehouse_entries',
                    'entries_departures__entries__repair_entries',
                    'entries_departures__entries__salepoint_entries'],
                priority: 4,
                children: [
                    {
                        name: 'ENTRIES.MENU.MANUAL',
                        type: 'dropdown',
                        icon: 'fa fa-hand-paper',
                        permission: ['entries_departures__entries__new_entries',
                            'entries_departures__entries__warranties_entries',
                            'entries_departures__entries__no_labeled_entries',
                            'entries_departures__entries__warehouse_entries',
                            'entries_departures__entries__repair_entries',
                            'entries_departures__entries__salepoint_entries'],
                        children: [

                            {
                                name: 'ENTRIES.MENU.NEW',
                                type: 'link',
                                permission: ['entries_departures__entries__new_entries'],
                                state: 'triangular.admin-default.entry-new-manual'
                            },
                            {
                                name: 'ENTRIES.MENU.WARRANTIES',
                                type: 'link',
                                permission: ['entries_departures__entries__warranties_entries'],
                                state: 'triangular.admin-default.entry-warranty-manual'
                            },
                            {
                                name: 'ENTRIES.MENU.UNRECOGNIZABLE',
                                type: 'link',
                                permission: ['entries_departures__entries__no_labeled_entries'],
                                state: 'triangular.admin-default.entry-unrecognizable-manual'
                            },
                            {
                                name: 'ENTRIES.MENU.WAREHOUSE',
                                type: 'link',
                                permission: ['entries_departures__entries__warehouse_entries'],
                                state: 'triangular.admin-default.entry-warehouse-manual'
                            },
                            {
                                name: 'ENTRIES.MENU.REPAIR',
                                type: 'link',
                                permission: ['entries_departures__entries__repair_entries', 'entries_departures__entries__salepoint_entries'],
                                state: 'triangular.admin-default.entry-repair-manual'
                            }
                        ]
                    },
                    //{
                    //    name: 'ENTRIES.MENU.MASSIVE',
                    //    type: 'dropdown',
                    //    icon: 'fa fa-file-csv',
                    //    permission: ['entries_departures__entries__new_entries',
                    //        'entries_departures__entries__warranties_entries',
                    //        'entries_departures__entries__no_labeled_entries',
                    //        'entries_departures__entries__warehouse_entries',
                    //        'entries_departures__entries__repair_entries'],
                    //    children: []
                    //},
                    {
                        name: 'ENTRIES.MENU.LIST',
                        type: 'link',
                        icon: 'fa fa-archive',
                        permission: ['entries_departures__entries__list_all_entries'],
                        state: 'triangular.admin-default.entries-list'
                    }
                ]

            }
        );
    }
})();
