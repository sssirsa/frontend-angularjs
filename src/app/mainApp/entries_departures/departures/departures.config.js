(function () {
    angular
        .module('app.mainApp.entries_departures.departures')
        .config(departuresConfig);

    function departuresConfig($translatePartialLoaderProvider, $stateProvider, triMenuProvider) {
        $translatePartialLoaderProvider.addPart('app/mainApp/entries_departures/departures');

        $stateProvider
            .state('triangular.admin-default.salida-crear', {
                url: '/crear',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
                    }
                },
                templateUrl: 'app/mainApp/entries_departures/departures/crear/salida.crear.tmpl.html',
                controller: 'salidaCrearController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.salida-list', {
                url: '/listado',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
                    }
                },
                templateUrl: 'app/mainApp/entries_departures/departures/lista/salida.lista.tmpl.html',
                controller: 'salidaListadoController',
                controllerAs: 'vm'
            });

        triMenuProvider.addMenu(
            {
                name: 'MAIN.MENU.OUT.TITLE',
                icon: 'fa fa-sign-out-alt',
                type: 'dropdown',
                permission_old: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN'],
                priority: 5,
                children: [
                    //{
                    //    name: 'MAIN.MENU.OUT.NEW',
                    //    type: 'link',
                    //    state: 'triangular.admin-default.salida-crear'
                    //}, {
                    //    name: 'MAIN.MENU.OUT.LIST',
                    //    type: 'link',
                    //    state: 'triangular.admin-default.salida-list'
                    //}
                ]
            }
        );
    }
})();
