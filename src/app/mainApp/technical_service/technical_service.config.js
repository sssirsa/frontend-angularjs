(function () {
    angular
        .module('app.mainApp.technical_service')
        .config(TechnicalServiceConfig);
    function TechnicalServiceConfig(
        $translatePartialLoaderProvider,
        $stateProvider,
        triMenuProvider
    ) {
        $translatePartialLoaderProvider.addPart('app/mainApp/technical_service');
        $stateProvider

            .state('triangular.admin-default.inspection', {
                url: '/Inspeccion',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/technical_service/inspection/inspection.tmpl.html',
                controller: 'inspectionController',
                controllerAs: 'vm'
            })

            .state('triangular.admin-default.puncture', {
                url: '/Pinchado',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/technical_service/puncture/puncture.tmpl.html',
                controller: 'punctureController',
                controllerAs: 'vm'
            })

            .state('triangular.admin-default.diagnostic', {
                url: '/Diagnostico',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/technical_service/diagnosis/diagnosis.tmpl.html',
                controller: 'diagnosisController',
                controllerAs: 'vm'
            })

            .state('triangular.admin-default.componentTest', {
                url: '/prueba_componente',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/technical_service/test/testComponent.tmpl.html',
                controller: 'testComponentController',
                controllerAs: 'vm'
            });

        triMenuProvider.addMenu(
            {
                name: 'MAIN.MENU.INTERNAL_SERVICE',
                icon: 'fa fa-cogs',
                type: 'dropdown',
                permission: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E'],
                priority: 6,
                children: [
                    {
                        name:'INSPECTION.INSPECTION_NAME_MENU',
                        state:'triangular.admin-default.inspection',
                        permission:['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E'],
                        type:'link'
                    },
                    {
                        name:'PUNCTURE.PUNCTURE_MENU',
                        state:'triangular.admin-default.puncture',
                        permission:['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E'],
                        type:'link'
                    },
                    {
                        name:'DIAGNOSIS.DIAGNOSIS',
                        state:'triangular.admin-default.diagnostic',
                        permission:['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E'],
                        type:'link'
                    },
                    {
                        name: 'Prueba de Componentes',
                        state: 'triangular.admin-default.componentTest',
                        permission: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E'],
                        type: 'link'
                    }

                ]
            }
        );

    }
}) ();
