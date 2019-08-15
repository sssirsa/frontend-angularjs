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

            //Atenciones y asignación
            .state('triangular.admin-default.list-attention', {
                url: '/salepoint/atenciones',
                data: {
                    permissions: {
                        only: ['sale_point__attentions__attention_all']
                    }
                },
                templateUrl: 'app/mainApp/salepoint/attentions/list_attentions.tmpl.html',
                controller: 'listAttentionController',
                controllerAs: 'vm'
            })
        ;

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
                        name: 'SALE_POINT.MENU.ATTENTION.TITLE',
                        type: 'link',
                        permission: ['sale_point__attentions__attention_all'],
                        state: 'triangular.admin-default.list-attention'
                    }
                ]
            }
        );
    }
})();
