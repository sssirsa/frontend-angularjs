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

        $stateProvider

        //Pre Solicitudes
            .state('triangular.admin-default.pre-request', {
                url: '/salepoint/pre-solicitud',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
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
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
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
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
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
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
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
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
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
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
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
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
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
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
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
                        only: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E', 'TULTITLAN']
                    }
                },
                templateUrl: 'app/mainApp/salepoint/request/list/detailRequest/deatilRequest.tmpl.html',
                controller: 'detailRequestController',
                controllerAs: 'vm'
            })

        ;

        /*
        $stateProvider
            .state('triangular.admin-default.serviceAssing', {
                url: '/asignarServicio',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/salepoint/asignacionServicio/asignacionServicio.tmpl.html',
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
            .state('triangular.admin-default.newRequest', {
                url: '/request/new',
                templateUrl: 'app/mainApp/salepoint/solicitudes/new/new-request-page.tmpl.html',
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
                templateUrl: 'app/mainApp/salepoint/solicitudes/list/list-requests-page.tmpl.html',
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
                templateUrl: 'app/mainApp/salepoint/solicitudes/detail/detail-request-page.tmpl.html',
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
                templateUrl: 'app/mainApp/salepoint/preRequestsDeleted/preRequest.tmpl.html',
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
                templateUrl: 'app/mainApp/salepoint/preRequestsDeleted/preRequest-detail.tmpl.html',
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
            .state('triangular.admin-default.attentionDetail', {
                url: '/atencion/:id',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/salepoint/atenciones/detail/detail-attention-page-tmpl.html',
                controller: 'DetailAttentionPageController',
                controllerAs: 'vm',
                params: {
                    id: null,
                    tipo: null
                }
            }); */

        triMenuProvider.addMenu(
            {
                name: 'SALE_POINT.MENU.TITLE',
                icon: 'fas fa-concierge-bell',
                type: 'dropdown',
                permission: ['ADMINISTRADOR', 'TULTITLAN'],
                priority: 4,
                children: [
                    {
                        name: 'SALE_POINT.MENU.PRE_REQUEST.TITLE',
                        type: 'link',
                        permission: ['ADMINISTRADOR', 'TULTITLAN'],
                        state: 'triangular.admin-default.pre-request'
                    },
                    {
                        name: 'SALE_POINT.MENU.REQUEST.TITLE',
                        type: 'dropdown',
                        permission: ['ADMINISTRADOR', 'TULTITLAN'],
                        children: [
                            {
                                name: 'SALE_POINT.MENU.REQUEST.NEW',
                                type: 'link',
                                permission: ['ADMINISTRADOR', 'TULTITLAN'],
                                state: 'triangular.admin-default.new-request'
                            },
                            {
                                name: 'SALE_POINT.MENU.REQUEST.INCREASE',
                                type: 'link',
                                permission: ['ADMINISTRADOR', 'TULTITLAN'],
                                state: 'triangular.admin-default.increase-request'
                            },
                            {
                                name: 'SALE_POINT.MENU.REQUEST.REMOVE',
                                type: 'link',
                                permission: ['ADMINISTRADOR', 'TULTITLAN'],
                                state: 'triangular.admin-default.remove-request'
                            },
                            {
                                name: 'SALE_POINT.MENU.REQUEST.EXCHANGE',
                                type: 'link',
                                permission: ['ADMINISTRADOR', 'TULTITLAN'],
                                state: 'triangular.admin-default.exchange-request'
                            },
                            {
                                name: 'SALE_POINT.MENU.REQUEST.TECHNICAL_SERVICE',
                                type: 'link',
                                permission: ['ADMINISTRADOR', 'TULTITLAN'],
                                state: 'triangular.admin-default.service-request'
                            },
                            {
                                name: 'SALE_POINT.MENU.REQUEST.LIST',
                                type: 'link',
                                permission: ['ADMINISTRADOR', 'TULTITLAN'],
                                state: 'triangular.admin-default.list-request'
                            }
                        ]

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
                        }, {
                            name: 'MAIN.MENU.REQUESTS.PREREQUEST',
                            state: 'triangular.admin-default.preRequest',
                            permission: ['ADMINISTRADOR', 'TECNICO A', 'TECNICO B', 'TECNICO C', 'TECNICO D', 'TECNICO E'],
                            type: 'link'
                        }
                        ]
                    },
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
