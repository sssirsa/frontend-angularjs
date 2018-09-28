(function () {
    angular
        .module('app.mainApp.entries')
        .config(entriesConfig);

    function entriesConfig($translatePartialLoaderProvider, $stateProvider, triMenuProvider) {
        $translatePartialLoaderProvider.addPart('app/mainApp/entries');
        $stateProvider
            .state('triangular.admin-default.entrada', {
                url: '/entrada',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
                    }
                },
                templateUrl: 'app/mainApp/entries/entrada.tmpl.html',
                controller: 'entradaController',
                controllerAs: 'vm'
            });
        triMenuProvider.addMenu(
            {
                name: 'MAIN.MENU.IN',
                icon: 'fa fa-sign-in',
                type: 'link',
                permission: ['ADMINISTRADOR'],
                priority: 4,
                state: 'triangular.admin-default.entrada'
            }
        );
    }
})();
