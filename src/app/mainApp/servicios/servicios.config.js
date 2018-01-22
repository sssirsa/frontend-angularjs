/**
 * Created by Emmanuel on 05/06/2016.
 */
(function () {
    angular
        .module('app.mainApp.servicios')
        .config(moduleConfig);

    function moduleConfig($stateProvider, $translatePartialLoaderProvider, triMenuProvider) {
        $translatePartialLoaderProvider.addPart('app/mainApp/servicios');
        $translatePartialLoaderProvider.addPart('app/mainApp/servicios/solicitudes');
        $stateProvider
            .state('triangular.admin-default.tecnico', {
                url: '/tecnico',
                data: {
                    roles: ['Administrador', 'Tecnico A', 'Tecnico B', 'Tecnico C', 'Tecnico D', 'Tecnico E']
                },
                templateUrl: 'app/mainApp/servicios/inicio/tecnico.tmpl.html',
                controller: 'tecnicoController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.checklist', {
                url: '/checklist',
                data: {
                    roles: ['Administrador', 'Tecnico A', 'Tecnico B', 'Tecnico C', 'Tecnico D', 'Tecnico E']
                },
                templateUrl: 'app/mainApp/servicios/checklist/checklist.tmpl.html',
                controller: 'checklistController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.diagnostic', {
                url: '/diagnostic',
                data: {
                    roles: ['Administrador', 'Tecnico A', 'Tecnico B', 'Tecnico C', 'Tecnico D', 'Tecnico E']
                },
                templateUrl: 'app/mainApp/servicios/diagnostic/diagnostic.tpl.html',
                controller: 'DiagnosticController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.etapa', {
                url: '/etapa',
                data: {
                    roles: ['Administrador', 'Tecnico A', 'Tecnico B', 'Tecnico C', 'Tecnico D', 'Tecnico E'],
                    layout: {
                        sideMenuSize: 'icon'
                    }
                },
                templateUrl: 'app/mainApp/servicios/etapa/etapa.tmpl.html',
                controller: 'etapaController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.asignacionLinea', {
                url: '/asignacionLinea',
                data: {
                    roles: ['Administrador', 'Tecnico A', 'Tecnico B', 'Tecnico C', 'Tecnico D', 'Tecnico E']
                },
                templateUrl: 'app/mainApp/servicios/asignacion/asignacionLinea.tmpl.html',
                controller: 'asignacionLineaController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.entrada', {
                url: '/entrada',
                data: {
                    roles: ['Administrador', 'Tecnico A', 'Tecnico B', 'Tecnico C', 'Tecnico D', 'Tecnico E', 'Tultitlan']
                },
                templateUrl: 'app/mainApp/servicios/entrada/entrada.tmpl.html',
                controller: 'entradaController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.salida-crear', {
                url: '/crear',
                data: {
                    roles: ['Administrador', 'Tecnico A', 'Tecnico B', 'Tecnico C', 'Tecnico D', 'Tecnico E', 'Tultitlan']
                },
                templateUrl: 'app/mainApp/servicios/salida/crear/salida.crear.tmpl.html',
                controller: 'salidaCrearController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.salida-list', {
                url: '/listado',
                data: {
                    roles: ['Administrador', 'Tecnico A', 'Tecnico B', 'Tecnico C', 'Tecnico D', 'Tecnico E', 'Tultitlan']
                },
                templateUrl: 'app/mainApp/servicios/salida/lista/salida.lista.tmpl.html',
                controller: 'salidaListadoController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.serviceAssing', {
                url: '/asignarServicio',
                data: {
                    roles: ['Administrador', 'Tultitlan', 'Tecnico E']
                },
                templateUrl: 'app/mainApp/servicios/asignacionServicio/asignacionServicio.tmpl.html',
                controller: 'asignacionServicioController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.serviceAssignDetail', {
                url:'/detalleServicio/:id',
                data: {
                    roles: ['Administrador', 'Tultitlan', 'Tecnico E']
                },
                templateUrl: 'app/mainApp/servicios/asignacionServicio/detalleAsignacion.tmpl.html',
                controller:'detalleAsignacionController',
                controllerAs:'vm',
                params:{
                    id:null
                }
            })
            .state('triangular.admin-default.newRequest', {
                url: '/request/new',
                templateUrl: 'app/mainApp/servicios/solicitudes/new/new-request-page.tmpl.html',
                controller: 'NewRequestPageController',
                controllerAs: 'vm',
                data: {
                    roles: ['Administrador', 'Tultitlan', 'Tecnico E'],
                    layout: {
                        contentClass: 'layout-column'
                    }
                }
            })
            .state('triangular.admin-default.listRequest', {
                url: '/request/list',
                templateUrl: 'app/mainApp/servicios/solicitudes/list/list-requests-page.tmpl.html',
                controller: 'ListRequestPageController',
                controllerAs: 'vm',
                data: {
                    roles: ['Administrador', 'Tultitlan', 'Tecnico E'],
                    layout: {
                        contentClass: 'layout-column'
                    }
                }
            })
            .state('triangular.admin-default.detailRequest', {
                url: '/request/detail/:id',
                templateUrl: 'app/mainApp/servicios/solicitudes/detail/detail-request-page.tmpl.html',
                controller: 'DetailRequestPageController',
                controllerAs: 'vm',
                params:{
                    id:null
                },
                data: {
                    roles: ['Administrador', 'Tultitlan', 'Tecnico E']
                }
            });

        triMenuProvider.addMenu(
            {
                name: 'MAIN.MENU.SERVICES',
                icon: 'fa fa-wrench',
                type: 'dropdown',
                permission: ['Administrador', 'Tecnico A', 'Tecnico B', 'Tecnico C', 'Tecnico D', 'Tecnico E', 'Tultitlan'],
                priority: 4,
                children: [
                    {
                        name: 'MAIN.MENU.START',
                        state: 'triangular.admin-default.tecnico',
                        type: 'link'
                    },
                    {
                        name: 'MAIN.MENU.IN',
                        state: 'triangular.admin-default.entrada',
                        permission: ['Administrador', 'Tultitlan'],
                        type: 'link'
                    }, {
                        name: 'MAIN.MENU.OUT.TITLE',
                        type: 'dropdown',
                        permission: ['Administrador', 'Tultitlan'],
                        children: [{
                            name: 'MAIN.MENU.OUT.NEW',
                            type: 'link',
                            state: 'triangular.admin-default.salida-crear'
                        }, {
                            name: 'MAIN.MENU.OUT.LIST',
                            type: 'link',
                            state: 'triangular.admin-default.salida-list'
                        }]
                    },
                    {
                        name: 'MAIN.MENU.REGISTER_STEP',
                        state: 'triangular.admin-default.etapa',
                        permission: ['Administrador', 'Tecnico A', 'Tecnico B', 'Tecnico C', 'Tecnico D', 'Tecnico E'],
                        type: 'link'
                    },
                    {
                        name: 'MAIN.MENU.LINE',
                        state: 'triangular.admin-default.asignacionLinea',
                        permission: ['Administrador', 'Tecnico A', 'Tecnico B', 'Tecnico C', 'Tecnico D', 'Tecnico E'],
                        type: 'link'
                    },
                    {
                        name: 'MAIN.MENU.SERVICE_ASSIGN.ASSIGN',
                        state:'triangular.admin-default.serviceAssing',
                        permission: ['Administrador', 'Tultitlan', 'Tecnico E'],
                        type: 'link'
                    },
                    {
                        name: 'MAIN.MENU.REQUESTS.TITLE',
                        type: 'dropdown',
                        children: [{
                            name: 'MAIN.MENU.REQUESTS.NEW',
                            state: 'triangular.admin-default.newRequest',
                            type: 'link'
                        },{
                            name: 'MAIN.MENU.REQUESTS.LIST',
                            state: 'triangular.admin-default.listRequest',
                            type: 'link'
                        }]
                    }
                ]
            }
        );

    }
})();
