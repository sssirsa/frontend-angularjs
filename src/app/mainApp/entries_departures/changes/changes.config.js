(function () {
    angular
        .module('app.mainApp.entries_departures.changes')
        .config(changesConfig);
    function changesConfig(
        triMenuProvider,
        $stateProvider,
        $translatePartialLoaderProvider
    ) {
        $translatePartialLoaderProvider.addPart('app/mainApp/entries_departures/changes');
        $stateProvider
            .state('triangular.admin-default.changes', {
                url: '/cambios/crear',
                data: {
                    permissions: {
                        only: [
                            'entries_departures__changes__change'
                        ]
                    }
                },
                templateUrl: 'app/mainApp/entries_departures/changes/manual/manualChanges.tmpl.html',
                controller: 'manualChangesController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.changes-list', {
                url: '/cambios/listado',
                data: {
                    permissions: {
                        only: [
                            'entries_departures__changes__list',
                            'entries_departures__changes__confirm'
                        ]
                    }
                },
                templateUrl: 'app/mainApp/entries_departures/changes/list/changeList.tmpl.html',
                controller: 'changesListController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.change-detail', {
                url: '/cambios/detalle/:changeId',
                data: {
                    permissions: {
                        only: [
                            'entries_departures__changes__list',
                            'entries_departures__changes__confirm'
                        ]
                    }
                },
                params: {
                    changeId: null,
                    change: null
                },
                templateUrl: 'app/mainApp/entries_departures/changes/detail/changeDetail.tmpl.html',
                controller: 'changesDetailController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.change-confirm', {
                url: '/cambios/confirmar/:changeId',
                data: {
                    permissions: {
                        only: [
                            'entries_departures__changes__confirm'
                        ]
                    }
                },
                params: {
                    changeId: null,
                    change: null
                },
                templateUrl: 'app/mainApp/entries_departures/changes/confirm/changeConfirm.tmpl.html',
                controller: 'changesConfirmController',
                controllerAs: 'vm'
            });

        triMenuProvider.addMenu(
            {
                name: 'CHANGES.MENU.TITLE',
                icon: 'fas fa-exchange-alt',
                type: 'dropdown',
                priority: 6,
                permission: [
                    'entries_departures__changes__list',
                    'entries_departures__changes__change',
                    'entries_departures__changes__confirm'
                ],
                children: [
                    {
                        name: 'CHANGES.MENU.MANUAL',
                        icon: 'fa fa-hand-paper',
                        type: 'dropdown',
                        permission: [
                            'entries_departures__changes__change'
                        ],
                        children: [
                            {
                                name: 'CHANGES.MENU.CREATE',
                                type: 'link',
                                permission: [
                                    'entries_departures__changes__change'
                                ],
                                state: 'triangular.admin-default.changes'
                            }
                        ]
                    },
                    // {
                    //     name:'DEPARTURES.MENU.MASSIVE',
                    //     type:'dropdown',
                    //     icon:'fa fa-file-csv',
                    //     permission:['entries_departures__changes__change'],
                    //     children:[]
                    // },
                    {
                        name: 'CHANGES.MENU.LIST',
                        icon: 'fa fa-archive',
                        type: 'link',
                        permission: [
                            'entries_departures__changes__list',
                            'entries_departures__changes__confirm'
                        ],
                        state: 'triangular.admin-default.changes-list'
                    }
                ]
            }
        );

    }

})();