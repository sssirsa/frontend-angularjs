(function () {
    angular
        .module('app.mainApp.external_service')
        .config(ExternalServiceConfig);

    function ExternalServiceConfig($translatePartialLoaderProvider, $stateProvider, triMenuProvider) {
        $translatePartialLoaderProvider.addPart('app/mainApp/external_service');
        $translatePartialLoaderProvider.addPart('app/mainApp/external_service/pre_request');
        $translatePartialLoaderProvider.addPart('app/mainApp/external_service/request');

        $stateProvider

            //Pre Solicitudes
            .state('triangular.admin-default.pre-request', {
                url: '/servicio_externo/pre-solicitud',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
                    }
                },
                templateUrl: 'app/mainApp/external_service/pre_request/preRequest.tmpl.html',
                controller: 'preRequestController',
                controllerAs: 'vm'
            })

            //Solicitudes
            .state('triangular.admin-default.new-request', {
                url: '/servicio_externo/solicitud/nuevo',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
                    }
                },
                templateUrl: 'app/mainApp/external_service/request/new/newRequest.tmpl.html',
                controller: 'newRequestController',
                controllerAs: 'vm'
            })

            .state('triangular.admin-default.increase-request', {
                url: '/servicio_externo/solicitud/incremental',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
                    }
                },
                templateUrl: 'app/mainApp/external_service/request/increase/increaseRequest.tmpl.html',
                controller: 'increaseRequestController',
                controllerAs: 'vm'
            })

            .state('triangular.admin-default.remove-request', {
                url: '/servicio_externo/solicitud/retiro',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
                    }
                },
                templateUrl: 'app/mainApp/external_service/request/remove/removeRequest.tmpl.html',
                controller: 'removeRequestController',
                controllerAs: 'vm'
            })

            .state('triangular.admin-default.exchange-request', {
                url: '/servicio_externo/solicitud/cambio',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
                    }
                },
                templateUrl: 'app/mainApp/external_service/request/exchange/exchangeRequest.tmpl.html',
                controller: 'exchangeRequestController',
                controllerAs: 'vm'
            })

            .state('triangular.admin-default.service-request', {
                url: '/servicio_externo/solicitud/servicio_tecnico',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
                    }
                },
                templateUrl: 'app/mainApp/external_service/request/technical_service/serviceRequest.tmpl.html',
                controller: 'serviceRequestController',
                controllerAs: 'vm'
            })

        ;

        triMenuProvider.addMenu(
            {
                name: 'EXTERNAL_SERVICE.MENU.TITLE',
                icon: 'fas fa-concierge-bell',
                type: 'dropdown',
                permission: ['ADMINISTRADOR', 'TULTITLAN'],
                priority: 4,
                children: [
                    {
                        name: 'EXTERNAL_SERVICE.MENU.PRE_REQUEST.TITLE',
                        type: 'link',
                        permission: ['ADMINISTRADOR', 'TULTITLAN'],
                        state: 'triangular.admin-default.pre-request'
                    },
                    {
                        name: 'EXTERNAL_SERVICE.MENU.REQUEST.TITLE',
                        type: 'dropdown',
                        permission: ['ADMINISTRADOR', 'TULTITLAN'],
                        children: [
                            {
                                name: 'EXTERNAL_SERVICE.MENU.REQUEST.NEW',
                                type: 'link',
                                permission: ['ADMINISTRADOR', 'TULTITLAN'],
                                state: 'triangular.admin-default.new-request'
                            },
                            {
                                name: 'EXTERNAL_SERVICE.MENU.REQUEST.INCREASE',
                                type: 'link',
                                permission: ['ADMINISTRADOR', 'TULTITLAN'],
                                state: 'triangular.admin-default.increase-request'
                            },
                            {
                                name: 'EXTERNAL_SERVICE.MENU.REQUEST.REMOVE',
                                type: 'link',
                                permission: ['ADMINISTRADOR', 'TULTITLAN'],
                                state: 'triangular.admin-default.remove-request'
                            },
                            {
                                name: 'EXTERNAL_SERVICE.MENU.REQUEST.EXCHANGE',
                                type: 'link',
                                permission: ['ADMINISTRADOR', 'TULTITLAN'],
                                state: 'triangular.admin-default.exchange-request'
                            },
                            {
                                name: 'EXTERNAL_SERVICE.MENU.REQUEST.TECHNICAL_SERVICE',
                                type: 'link',
                                permission: ['ADMINISTRADOR', 'TULTITLAN'],
                                state: 'triangular.admin-default.service-request'
                            }
                        ]

                    }
                ]

            }
        );
    }
})

();
