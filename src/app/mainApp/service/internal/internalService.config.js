(function () {
    angular
        .module('app.mainApp.service.internal')
        .config(internalServiceConfig);

    function internalServiceConfig($stateProvider, triMenuProvider) {
        $stateProvider
            .state('triangular.admin-default.checklist', {
                url: '/checklist',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/service/internal/checklist/checklist.tmpl.html',
                controller: 'checklistController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.diagnostic', {
                url: '/diagnostic',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/service/internal/diagnostic/diagnostic.tpl.html',
                controller: 'DiagnosticController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.etapa', {
                url: '/etapa',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E']
                    },
                    layout: {
                        sideMenuSize: 'icon'
                    }
                },
                templateUrl: 'app/mainApp/service/internal/etapa/etapa.tmpl.html',
                controller: 'etapaController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.asignacionLinea', {
                url: '/asignacionLinea',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/service/internal/asignacion/asignacionLinea.tmpl.html',
                controller: 'asignacionLineaController',
                controllerAs: 'vm'
            });


        triMenuProvider.addMenu(
            {
                name: 'MAIN.MENU.INTERNAL_SERVICE',
                icon: 'fa fa-cogs',
                type: 'dropdown',
                permission: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN'],
                priority: 4,
                children: [
                    {
                        name: 'MAIN.MENU.REGISTER_STEP',
                        state: 'triangular.admin-default.etapa',
                        permission: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E'],
                        type: 'link'
                    },
                    {
                        name: 'MAIN.MENU.LINE',
                        state: 'triangular.admin-default.asignacionLinea',
                        permission: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E'],
                        type: 'link'
                    }
                ]
            }
        );

    }
})();
