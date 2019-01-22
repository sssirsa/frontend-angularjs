(function () {
    angular
        .module('app.mainApp.entries_departures.departures')
        .config(departuresConfig);

    function departuresConfig($translatePartialLoaderProvider, $stateProvider, triMenuProvider) {
        $translatePartialLoaderProvider.addPart('app/mainApp/entries_departures/departures');
        $stateProvider
            /* New asset entries */
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
            /* Warranty asset entries */
            .state('triangular.admin-default.departure-warranty-manual', {
                url: '/salida/garantias/manual',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
                    }
                },
                templateUrl: 'app/mainApp/entries_departures/departures/warranty/manual/warrantyManualDeparture.tmpl.html',
                controller: 'warrantyManualDepartureController',
                controllerAs: 'vm'
            })
            /* Unrecognizable asset entries */
            .state('triangular.admin-default.departure-unrecognizable-manual', {
                url: '/salida/no_capitalizados/manual',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
                    }
                },
                templateUrl: 'app/mainApp/entries_departures/departures/unrecognizable/manual/unrecognizableManualDeparture.tmpl.html',
                controller: 'unrecognizableManualDepartureController',
                controllerAs: 'vm'
            })
            /* Obsolete asset entries */
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
            ;
        triMenuProvider.addMenu(
            {
                name: 'DEPARTURES.MENU.TITLE',
                icon: 'fa fa-sign-out-alt',
                type: 'dropdown',
                permission: ['ADMINISTRADOR', 'TULTITLAN'],
                priority: 5,
                children: [
                    {
                        name: 'DEPARTURES.MENU.NEW',
                        type: 'link',
                        permission: ['ADMINISTRADOR', 'TULTITLAN'],
                        state: 'triangular.admin-default.departure-new-manual'
                    },
                    {
                        name: 'DEPARTURES.MENU.WARRANTIES',
                        type: 'link',
                        permission: ['ADMINISTRADOR', 'TULTITLAN'],
                        state: 'triangular.admin-default.departure-warranty-manual'
                    },
                    {
                        name: 'DEPARTURES.MENU.UNRECOGNIZABLE',
                        type: 'link',
                        permission: ['ADMINISTRADOR', 'TULTITLAN'],
                        state: 'triangular.admin-default.departure-unrecognizable-manual'
                    },
                    {
                        name: 'DEPARTURES.MENU.OBSOLETE',
                        type: 'link',
                        permission: ['ADMINISTRADOR', 'TULTITLAN'],
                        state: 'triangular.admin-default.departure-obsolete-manual'
                    }
                ]

            }
        );
    }
})();
