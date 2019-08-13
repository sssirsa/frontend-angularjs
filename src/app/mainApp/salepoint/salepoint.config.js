(function () {
    angular
        .module('app.mainApp.salepoint')
        .config(salepointConfig);
    function salepointConfig(
        $stateProvider,
        $translatePartialLoaderProvider,
        triMenuProvider
    ) {
        $translatePartialLoaderProvider.addPart('app/mainApp/salepoint');
        $translatePartialLoaderProvider.addPart('app/mainApp/salepoint/pre_request');
        $translatePartialLoaderProvider.addPart('app/mainApp/salepoint/request');
        $translatePartialLoaderProvider.addPart('app/mainApp/salepoint/service_assignment');

        $stateProvider

        //Pre Solicitudes
            .state('triangular.admin-default.pre-request', {
                url: '/salepoint/pre-solicitud',
                data: {
                    permissions: {
                        only: ['sale_point__pre_request__pre_request']
                    }
                },
                templateUrl: 'app/mainApp/salepoint/pre_request/preRequest.tmpl.html',
                controller: 'preRequestController',
                controllerAs: 'vm'
            })

            .state('triangular.admin-default.detail-pre-request', {
                url: '/salepoint/pre-solicitud/detalle',
                data: {
                    permissions: {
                        only: ['sale_point__pre_request__pre_request_to_request']
                    }
                },
                params: {
                    id: null
                },
                templateUrl: 'app/mainApp/salepoint/pre_request/detail_pre_request/detailPreRequest.tmpl.html',
                controller: 'detailPreRequestController',
                controllerAs: 'vm'
            })

            //Solicitudes
            .state('triangular.admin-default.new-request', {
                url: '/salepoint/solicitud/nuevo',
                data: {
                    permissions: {
                        only: ['sale_point__request__register']
                    }
                },
                templateUrl: 'app/mainApp/salepoint/request/new/newRequest.tmpl.html',
                controller: 'newRequestController',
                controllerAs: 'vm'
            })

            .state('triangular.admin-default.increase-request', {
                url: '/salepoint/solicitud/incremental',
                data: {
                    permissions: {
                        only: ['sale_point__request__incremental']
                    }
                },
                templateUrl: 'app/mainApp/salepoint/request/increase/increaseRequest.tmpl.html',
                controller: 'increaseRequestController',
                controllerAs: 'vm'
            })

            .state('triangular.admin-default.remove-request', {
                url: '/salepoint/solicitud/retiro',
                data: {
                    permissions: {
                        only: ['sale_point__request__retrieve']
                    }
                },
                templateUrl: 'app/mainApp/salepoint/request/remove/removeRequest.tmpl.html',
                controller: 'removeRequestController',
                controllerAs: 'vm'
            })

            .state('triangular.admin-default.exchange-request', {
                url: '/salepoint/solicitud/cambio',
                data: {
                    permissions: {
                        only: ['sale_point__request__change']
                    }
                },
                templateUrl: 'app/mainApp/salepoint/request/exchange/exchangeRequest.tmpl.html',
                controller: 'exchangeRequestController',
                controllerAs: 'vm'
            })

            .state('triangular.admin-default.service-request', {
                url: '/salepoint/solicitud/servicio_tecnico',
                data: {
                    permissions: {
                        only: ['sale_point__request__technical_service']
                    }
                },
                templateUrl: 'app/mainApp/salepoint/request/technical_service/serviceRequest.tmpl.html',
                controller: 'serviceRequestController',
                controllerAs: 'vm'
            })

            .state('triangular.admin-default.list-request', {
                url: '/salepoint/solicitud/listado',
                data: {
                    permissions: {
                        only: ['sale_point__request__request']
                    }
                },
                templateUrl: 'app/mainApp/salepoint/request/list/listRequest.tmpl.html',
                controller: 'listRequestController',
                controllerAs: 'vm'
            })

            .state('triangular.admin-default.detail-request', {
                url: '/salepoint/solicitud/detalle',
                data: {
                    permissions: {
                        only: ['sale_point__clients__info_service']
                    }
                },
                params: {
                    id: null
                },
                templateUrl: 'app/mainApp/salepoint/request/list/detailRequest/deatilRequest.tmpl.html',
                controller: 'detailRequestController',
                controllerAs: 'vm'
            })

            // Atenciones
            .state('triangular.admin-default.service-assignment', {
                url: '/salepoint/asignar-servicio',
                data: {
                    permissions: {
                        only: ['sale_point__attentions__attention_asign']
                    }
                },
                templateUrl: 'app/mainApp/salepoint/service_assignment/service_assignment.tmpl.html',
                controller: 'serviceAssignmentController',
                controllerAs: 'vm'
            })

            /*.state('triangular.admin-default.service-assignment-detail', {
                url: 'salepoint/atencion/:id',
                data: {
                    permissions: {
                        only: ['sale_point__attentions__attention_asign']
                    }
                },
                templateUrl: 'app/mainApp/salepoint/service_assignment/dialog/dialogAssignationTechnician.tmpl.html',
                controller: 'dialogAsignationTechnicianController',
                controllerAs: 'vm',
                params: {
                    id: null,
                    tipo: null
                }
            })*/
        ;

        /*
        $stateProvider

            .state('triangular.admin-default.serviceAssignDetail', {
                url: '/detalleServicio/:id',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/salepoint/asignacionServicio/detalleAsignacion.tmpl.html',
                controller: 'detalleAsignacionController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.serviceList', {
                url: '/listarServicios',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/salepoint/atenciones/list/list-atention-page.tmpl.html',
                controller: 'listAtentionController',
                controllerAs: 'vm',
                params: {
                    runListPendientes: null,
                    runListTodos: null
                }
            })

            }); */

        triMenuProvider.addMenu(
            {
                name: 'SALE_POINT.MENU.TITLE',
                icon: 'fas fa-concierge-bell',
                type: 'dropdown',
                permission: ['sale_point__pre_request__pre_request',
                    'sale_point__request__request',
                    'sale_point__attentions__attention_asign'],
                priority: 4,
                children: [
                    {
                        name: 'SALE_POINT.MENU.PRE_REQUEST.TITLE',
                        type: 'link',
                        permission: ['sale_point__pre_request__pre_request'],
                        state: 'triangular.admin-default.pre-request'
                    },
                    {
                        name: 'SALE_POINT.MENU.REQUEST.TITLE',
                        type: 'dropdown',
                        permission: ['sale_point__request__request'],
                        children: [
                            {
                                name: 'SALE_POINT.MENU.REQUEST.LIST',
                                type: 'link',
                                permission: ['sale_point__request__request'],
                                state: 'triangular.admin-default.list-request'
                            },
                            {
                                name: 'SALE_POINT.MENU.REQUEST.NEW',
                                type: 'link',
                                permission: ['sale_point__request__register'],
                                state: 'triangular.admin-default.new-request'
                            },
                            {
                                name: 'SALE_POINT.MENU.REQUEST.INCREASE',
                                type: 'link',
                                permission: ['sale_point__request__incremental'],
                                state: 'triangular.admin-default.increase-request'
                            },
                            {
                                name: 'SALE_POINT.MENU.REQUEST.REMOVE',
                                type: 'link',
                                permission: ['sale_point__request__retrieve'],
                                state: 'triangular.admin-default.remove-request'
                            },
                            {
                                name: 'SALE_POINT.MENU.REQUEST.EXCHANGE',
                                type: 'link',
                                permission: ['sale_point__request__change'],
                                state: 'triangular.admin-default.exchange-request'
                            },
                            {
                                name: 'SALE_POINT.MENU.REQUEST.TECHNICAL_SERVICE',
                                type: 'link',
                                permission: ['sale_point__request__technical_service'],
                                state: 'triangular.admin-default.service-request'
                            }
                        ]

                    },
                    {
                        name: 'SALE_POINT.MENU.ASSIGMENT.TITLE',
                        state: 'triangular.admin-default.service-assignment',
                        permission: ['sale_point__attentions__attention_asign'],
                        type: 'link'
                    }
                ]
            }
        );

        /*
        triMenuProvider.addMenu(
            {
                name: 'MAIN.MENU.EXTERNAL_SERVICE',
                icon: 'fa fa-wrench',
                type: 'dropdown',
                permission: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E'],
                priority: 7,
                children: [
                    {
                        name: 'MAIN.MENU.SERVICE.MENU_TITLE',
                        state: 'triangular.admin-default.serviceList',
                        permission: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E'],
                        type: 'link'
                    }
                ]
            }
        ); */
    }
})();
