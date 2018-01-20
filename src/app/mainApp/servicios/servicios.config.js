/**
 * Created by Emmanuel on 05/06/2016.
 */
(function () {
    angular
        .module('app.mainApp.tecnico')
        .config(moduleConfig);

    function moduleConfig($stateProvider, $translatePartialLoaderProvider, triMenuProvider) {
        $translatePartialLoaderProvider.addPart('app/mainApp/tecnico');
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
                url:'/detalleServicio/:tipo/:id',
                data: {
                    roles: ['Administrador', 'Tultitlan', 'Tecnico E']
                },
                templateUrl: 'app/mainApp/servicios/asignacionServicio/detalleAsignacion.tmpl.html',
                controller:'detalleAsignacionController',
                controllerAs:'vm',
                params:{
                    id:null
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
                    }
                ]
            }
        );

    }
})();
