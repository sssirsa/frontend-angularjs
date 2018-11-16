(function () {
    angular
        .module('app.mainApp.service.external')
        .config(externalServiceConfig);

    function externalServiceConfig($stateProvider, $translatePartialLoaderProvider, triMenuProvider) {
        $translatePartialLoaderProvider.addPart('app/mainApp/service/external/solicitudes');
        $stateProvider
            .state('triangular.admin-default.serviceAssing', {
                url: '/asignarServicio',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/service/external/asignacionServicio/asignacionServicio.tmpl.html',
                controller: 'asignacionServicioController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.serviceAssignDetail', {
                url: '/detalleServicio/:id',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/service/external/asignacionServicio/detalleAsignacion.tmpl.html',
                controller: 'detalleAsignacionController',
                controllerAs: 'vm',
            })
            .state('triangular.admin-default.serviceList', {
                url: '/listarServicios',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/service/external/atenciones/list/list-atention-page.tmpl.html',
                controller: 'listAtentionController',
                controllerAs: 'vm',
                params: {
                    runListPendientes: null,
                    runListTodos: null
                }
            })
            .state('triangular.admin-default.newRequest', {
                url: '/request/new',
                templateUrl: 'app/mainApp/service/external/solicitudes/new/new-request-page.tmpl.html',
                controller: 'NewRequestPageController',
                controllerAs: 'vm',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                }
            })
            .state('triangular.admin-default.listRequest', {
                url: '/request/list',
                templateUrl: 'app/mainApp/service/external/solicitudes/list/list-requests-page.tmpl.html',
                controller: 'ListRequestPageController',
                controllerAs: 'vm',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                }
            })
            .state('triangular.admin-default.detailRequest', {
                url: '/request/detail/:id',
                templateUrl: 'app/mainApp/service/external/solicitudes/detail/detail-request-page.tmpl.html',
                controller: 'DetailRequestPageController',
                controllerAs: 'vm',
                params: {
                    id: null
                },
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                }
            })
            .state('triangular.admin-default.preRequest', {
                url: '/prerequest/list',
                templateUrl: 'app/mainApp/service/external/preRequests/preRequest.tmpl.html',
                controller: 'preRequestListController',
                controllerAs: 'vm',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                }
            })

            .state('triangular.admin-default.preRequestDetail', {
                url: '/prerequest-detail:idPreRequest/',
                templateUrl: 'app/mainApp/service/external/preRequests/preRequest-detail.tmpl.html',
                controller: 'preRequestDetailController',
                controllerAs: 'vm',
                params: {
                    idPreRequest: null
                },
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                }
            })


            /*.state('triangular.admin-default.cabinetPV', {
                url: '/cabinet-pv/new',
                templateUrl: 'app/mainApp/service/external/cabinetPV/pv-cabinet.tmpl.html',
                controller: 'NewCabinetPrerequestController',
                controllerAs: 'vm',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                }
            })*/

            .state('triangular.admin-default.attentionDetail', {
                url: '/atencion/:id',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/service/external/atenciones/detail/detail-attention-page-tmpl.html',
                controller: 'DetailAttentionPageController',
                controllerAs: 'vm',
                params: {
                    id: null,
                    tipo: null
                }
            });


        triMenuProvider.addMenu(
            {
                name: 'MAIN.MENU.EXTERNAL_SERVICE',
                icon: 'fa fa-wrench',
                type: 'dropdown',
                permission: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E'],
                priority: 7,
                children: [
                    {
                        name: 'MAIN.MENU.SERVICE.ASSIGN',
                        state: 'triangular.admin-default.serviceAssing',
                        permission: ['ADMINISTRADOR', 'TECNICO E'],
                        type: 'link'
                    },
                    {
                        name: 'MAIN.MENU.REQUESTS.TITLE',
                        type: 'dropdown',
                        children: [{
                            name: 'MAIN.MENU.REQUESTS.NEW',
                            state: 'triangular.admin-default.newRequest',
                            type: 'link'
                        }, {
                            name: 'MAIN.MENU.REQUESTS.LIST',
                            state: 'triangular.admin-default.listRequest',
                            type: 'link'
                        },{
                            name: 'MAIN.MENU.REQUESTS.PREREQUEST',
                            state: 'triangular.admin-default.preRequest',
                            permission: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E'],
                            type: 'link'
                        }
                        ]
                    },
                    {
                        name : 'MAIN.MENU.SERVICE.MENU_TITLE',
                        state: 'triangular.admin-default.serviceList',
                        permission: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E'],
                        type: 'link'
                    }/*,
                    {
                        name: 'MAIN.MENU.PREREQUESTS.NEWCABINET',
                        state: 'triangular.admin-default.cabinetPV',
                        permission: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E'],
                        type: 'link'
                    }*/
                ]
            }
        );

    }
})();