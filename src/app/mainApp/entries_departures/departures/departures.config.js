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
                        only: ['entries_departures__departures__news_departures']
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
                        only: ['entries_departures__departures__scrapped_departures']
                    }
                },
                templateUrl: 'app/mainApp/entries_departures/departures/obsolete/manual/obsoleteManualDeparture.tmpl.html',
                controller: 'obsoleteManualDepartureController',
                controllerAs: 'vm'
            })
            /* Salepoint asset departures */
            .state('triangular.admin-default.departure-salepoint-manual', {
                url: '/salida/punto_de_venta/manual',
                data: {
                    permissions: {
                        only: ['entries_departures__departures__salepoint_departures']
                    }
                },
                templateUrl: 'app/mainApp/entries_departures/departures/salepoint/manual/salepointManualDeparture.tmpl.html',
                controller: 'salepointManualDepartureController',
                controllerAs: 'vm'
            })
            /* Warehouse asset departures */
            .state('triangular.admin-default.departure-warehouse-manual', {
                url: '/salida/buen_estado/manual',
                data: {
                    permissions: {
                        only: ['entries_departures__departures__warehouse_departures']
                    }
                },
                templateUrl: 'app/mainApp/entries_departures/departures/warehouse/manual/warehouseManualDeparture.tmpl.html',
                controller: 'warehouseManualDepartureController',
                controllerAs: 'vm'
            })
            /* Warranty asset departures */
            .state('triangular.admin-default.departure-warranty-manual', {
                url: '/salida/garantias/manual',
                data: {
                    permissions: {
                        only: ['entries_departures__departures__warranties_departures']
                    }
                },
                templateUrl: 'app/mainApp/entries_departures/departures/warranty/manual/warrantyManualDeparture.tmpl.html',
                controller: 'warrantyManualDepartureController',
                controllerAs: 'vm'
            })
            /* List entries */
            .state('triangular.admin-default.departures-list', {
                url: '/salida/listado',
                data: {
                    permissions: {
                        only: ['entries_departures__departures__list_all_departures']
                    }
                },
                templateUrl: 'app/mainApp/entries_departures/departures/list/departuresList.tmpl.html',
                controller: 'departuresListController',
                controllerAs: 'vm'
            })
            /* Entry detail */
            .state('triangular.admin-default.departure-detail', {
                url: '/salida/detalle/:departureId',
                data: {
                    permissions: {
                        only: [
                            'entries_departures__departures__list_all_departures',
                            'entries_departures__departures__new_departures',
                            'entries_departures__departures__warranties_departures',
                            'entries_departures__departures__no_labeled_departures',
                            'entries_departures__departures__salepoint_departures',
                            'entries_departures__departures__warehouse_departures',
                            'entries_departures__departures__repair_departures']
                    }
                },
                params: {
                    departureId: null,
                    departure: null
                },
                templateUrl: 'app/mainApp/entries_departures/departures/detail/departureDetail.tmpl.html',
                controller: 'departureDetailController',
                controllerAs: 'vm'
            })
            ;
        triMenuProvider.addMenu(
            {
                name: 'DEPARTURES.MENU.TITLE',
                icon: 'fa fa-sign-out-alt',
                type: 'dropdown',
                permission: [
                    'entries_departures__departures__list_all_departures',
                    'entries_departures__departures__news_departures',
                    'entries_departures__departures__warranties_departures',
                    'entries_departures__departures__scrapped_departures',
                    'entries_departures__departures__warehouse_departures',
                    'entries_departures__departures__salepoint_departures'
                ],
                priority: 5,
                children: [
                    {
                        name: 'DEPARTURES.MENU.MANUAL',
                        type: 'dropdown',
                        icon: 'fa fa-hand-paper',
                        permission: [
                            'entries_departures__departures__news_departures',
                            'entries_departures__departures__warranties_departures',
                            'entries_departures__departures__scrapped_departures',
                            'entries_departures__departures__warehouse_departures',
                            'entries_departures__departures__salepoint_departures'
                        ],
                        children: [
                            {
                                name:'DEPARTURES.MENU.NEW',
                                type: 'link',
                                permission: ['entries_departures__departures__news_departures'],
                                state: 'triangular.admin-default.departure-new-manual'
                            },
                            {
                                name: 'DEPARTURES.MENU.OBSOLETE',
                                type: 'link',
                                permission: ['entries_departures__departures__scrapped_departures'],
                                state: 'triangular.admin-default.departure-obsolete-manual'
                            },
                            {
                                name: 'DEPARTURES.MENU.SALEPOINT',
                                type: 'link',
                                permission: ['entries_departures__departures__salepoint_departures'],
                                state: 'triangular.admin-default.departure-salepoint-manual'
                            },
                            {
                                name: 'DEPARTURES.MENU.WAREHOUSE',
                                type: 'link',
                                permission: ['entries_departures__departures__warehouse_departures'],
                                state: 'triangular.admin-default.departure-warehouse-manual'
                            },
                            {
                                name: 'DEPARTURES.MENU.WARRANTY',
                                type: 'link',
                                permission: ['entries_departures__departures__warranties_departures'],
                                state: 'triangular.admin-default.departure-warranty-manual'
                            }
                        ]
                    },
                    //{
                    //    name: 'DEPARTURES.MENU.MASSIVE',
                    //    type: 'dropdown',
                    //    icon: 'fa fa-file-csv',
                    //    permission: ['entries_departures__departures__new_departures',
                    //        'entries_departures__departures__warranties_departures',
                    //        'entries_departures__departures__no_labeled_departures',
                    //        'entries_departures__departures__scrapped_departures',
                    //        'entries_departures__departures__repair_departures'],
                    //    children: []
                    //},
                    {
                        name: 'DEPARTURES.MENU.LIST',
                        type: 'link',
                        icon: 'fa fa-archive',
                        permission: ['entries_departures__departures__list_all_departures'],
                        state: 'triangular.admin-default.departures-list'
                    }
                ]
            }
        );
    }
})();
