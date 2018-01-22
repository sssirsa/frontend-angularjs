(function () {
    'use strict';

    angular
        .module('app.mainApp.catalogos')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, $translatePartialLoaderProvider, triMenuProvider) {
        $translatePartialLoaderProvider.addPart('app/mainApp/catalogos');
        $stateProvider

            .state('triangular.admin-default.proveedor', {
                // set the url of this page
                url: '/proveedor',
                data: {
                    roles: ['Administrador', 'Capturista']
                },
                // set the html template to show on this page
                templateUrl: 'app/mainApp/catalogos/proveedor/proveedor.tmpl.html',
                // set the controller to load for this page
                controller: 'ProveedorController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.linea-transporte', {
                // set the url of this page
                url: '/lineaTransporte',
                data: {
                    roles: ['Administrador']
                },
                // set the html template to show on this page
                templateUrl: 'app/mainApp/catalogos/lineaTransporte/lineaTransporte.tmpl.html',
                // set the controller to load for this page
                controller: 'LineaTransporteController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.tipo-transporte', {
                // set the url of this page
                url: '/tipoTransporte',
                data: {
                    roles: ['Administrador']
                },
                // set the html template to show on this page
                templateUrl: 'app/mainApp/catalogos/tipoTransporte/tipoTransporte.tmpl.html',
                // set the controller to load for this page
                controller: 'TipoTransporteController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.udn-catalog', {
                // set the url of this page
                url: '/udn',
                data: {
                    roles: ['Administrador']
                },
                // set the html template to show on this page
                templateUrl: 'app/mainApp/catalogos/udn/udn.tmpl.html',
                // set the controller to load for this page
                controller: 'UDNController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.sucursal', {
                // set the url of this page
                url: '/sucursal',
                data: {
                    roles: ['Administrador']
                },
                // set the html template to show on this page
                templateUrl: 'app/mainApp/catalogos/sucursal/sucursal.tmpl.html',
                // set the controller to load for this page
                controller: 'SucursalController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.model-cabinet', {
                // set the url of this page
                url: '/modelCabinet',
                data: {
                    roles: ['Administrador']
                },
                // set the html template to show on this page
                templateUrl: 'app/mainApp/catalogos/modeloCabinet/modeloCabinet.tmpl.html',
                // set the controller to load for this page
                controller: 'ModeloCabinetController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.marca-cabinet', {
                // set the url of this page
                url: '/marcaCabinet',
                data: {
                    roles: ['Administrador']
                },
                // set the html template to show on this page
                templateUrl: 'app/mainApp/catalogos/marcaCabinet/marcaCabinet.tmpl.html',
                // set the controller to load for this page
                controller: 'MarcaCabinetController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.proyectos', {
                url: '/proyectos',
                data: {
                    roles: ['Administrador']
                },
                templateUrl: 'app/mainApp/catalogos/proyectos/proyectos.tmpl.html',
                controller: 'proyectosController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.clientes', {
                url: '/clientes',
                data: {
                    roles: ['Administrador']
                },
                templateUrl: 'app/mainApp/catalogos/clientes/cliente.tmpl.html',
                controller: 'clienteController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.categoria', {
                url: '/categoria',
                data: {
                    roles: ['Administrador', 'Capturista']
                },
                templateUrl: 'app/mainApp/catalogos/categoria/categoria.tmpl.html',
                controller: 'CategoriaController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.catalogo-insumo', {
                url: '/catalogo-insumo',
                data: {
                    roles: ['Administrador']
                },
                templateUrl: 'app/mainApp/catalogos/catalogo_insumo/catalogo_insumo.tmpl.html',
                controller: 'CatalogoInsumoController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.catalogo-tipo-equipo', {
                url: '/catalogo-tipo-equipo',
                data: {
                    roles: ['Administrador']
                },
                templateUrl: 'app/mainApp/catalogos/tipoEquipo/tipoEquipo.tmpl.html',
                controller: 'TipoEquipoController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.catalogo-etapas', {
                url: '/catalogo-etapas',
                data: {
                    roles: ['Administrador']
                },
                templateUrl: 'app/mainApp/catalogos/etapas/etapas.tmpl.html',
                controller: 'EtapasController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.catalogo-rutas',{
                url:'/rutas',
                data:{
                    roles:['Administrador']
                },
                templateUrl:'app/mainApp/catalogos/routes/routes.tmpl.html',
                controller: 'routesController',
                controllerAs:'vm'
            })
            .state('triangular.admin-default.catalogo-localidades',{
                url:'/localidades',
                data:{
                    roles:['Administrador']
                },
                templateUrl:'app/mainApp/catalogos/localities/localities.tmpl.html',
                controller: 'localitiesController',
                controllerAs:'vm'
            })
            .state('triangular.admin-default.catalogo-establecimientos',{
                url:'/establecimientos',
                data:{
                    roles:['Administrador']
                },
                templateUrl:'app/mainApp/catalogos/stores/stores.tmpl.html',
                controller: 'storesController',
                controllerAs:'vm'
            })
            .state('triangular.admin-default.catalogo-estados',{
                url:'/estados',
                data:{
                    roles:['Administrador']
                },
                templateUrl:'app/mainApp/catalogos/states/states.tmpl.html',
                controller: 'statesController',
                controllerAs:'vm'
            })
            .state('triangular.admin-default.catalogo-municipios',{
                url:'/municipios',
                data:{
                    roles:['Administrador']
                },
                templateUrl:'app/mainApp/catalogos/cities/cities.tmpl.html',
                controller: 'citiesController',
                controllerAs:'vm'
            });

        triMenuProvider.addMenu(
            {
                name: 'MAIN.MENU.CATALOGS.TITLE',
                icon: 'fa fa-book',
                type: 'dropdown',
                permission: ['Administrador', 'Capturista'],
                priority: 5,
                children: [

                    {
                        name: 'MAIN.MENU.CATALOGS.TRANSPORT_LINE',
                        state: 'triangular.admin-default.linea-transporte',
                        permission: ['Administrador'],
                        type: 'link'
                    }, {
                        name: 'MAIN.MENU.CATALOGS.TRANSPORT_TYPE',
                        state: 'triangular.admin-default.tipo-transporte',
                        permission: ['Administrador'],
                        type: 'link'
                    }, {
                        name: 'MAIN.MENU.CATALOGS.UDN',
                        state: 'triangular.admin-default.udn-catalog',
                        permission: ['Administrador'],
                        type: 'link'
                    }, {
                        name: 'MAIN.MENU.CATALOGS.SUBSIDIARY',
                        state: 'triangular.admin-default.sucursal',
                        permission: ['Administrador'],
                        type: 'link'
                    }, {
                        name: 'MAIN.MENU.CATALOGS.CABINET_BRAND',
                        state: 'triangular.admin-default.marca-cabinet',
                        permission: ['Administrador'],
                        type: 'link'
                    }, {
                        name: 'MAIN.MENU.CATALOGS.CABINET_MODEL',
                        state: 'triangular.admin-default.model-cabinet',
                        permission: ['Administrador'],
                        type: 'link'
                    }, {
                        name: 'MAIN.MENU.CATALOGS.PROJECTS',
                        state: 'triangular.admin-default.proyectos',
                        permission: ['Administrador'],
                        type: 'link'
                    },
                    {
                        name: 'MAIN.MENU.CATALOGS.CLIENT',
                        state: 'triangular.admin-default.clientes',
                        permission: ['Administrador'],
                        type: 'link'
                    },
                    {
                        name: 'MAIN.MENU.CATALOGS.EQUIPMENT_TYPE',
                        state: 'triangular.admin-default.catalogo-tipo-equipo',
                        permission: ['Administrador'],
                        type: 'link'
                    }, {
                        name: 'MAIN.MENU.CATALOGS.STAGE',
                        state: 'triangular.admin-default.catalogo-etapas',
                        permission: ['Administrador'],
                        type: 'link'
                    }, {
                        name: 'MAIN.MENU.CATALOGS.CONSUMABLE_CATALOG',
                        state: 'triangular.admin-default.catalogo-insumo',
                        permission: ['Administrador'],
                        type: 'link'
                    },{
                        name: 'MAIN.MENU.CATALOGS.CONSUMABLE_CATEGORY',
                        state: 'triangular.admin-default.categoria',
                        permission: ['Administrador', 'Capturista'],
                        type: 'link'
                    }, {
                        name: 'MAIN.MENU.CATALOGS.PROVIDER',
                        state: 'triangular.admin-default.proveedor',
                        permission: ['Administrador', 'Capturista'],
                        type: 'link'
                    }, {
                        name: 'MAIN.MENU.CATALOGS.ROUTES',
                        state: 'triangular.admin-default.catalogo-rutas',
                        permission: ['Administrador'],
                        type: 'link'
                    },{
                        name: 'MAIN.MENU.CATALOGS.LOCALITIES',
                        state: 'triangular.admin-default.catalogo-localidades',
                        permission: ['Administrador'],
                        type: 'link'
                    },{
                        name: 'MAIN.MENU.CATALOGS.STATES',
                        state: 'triangular.admin-default.catalogo-estados',
                        permission: ['Administrador'],
                        type: 'link'
                    },{
                        name: 'MAIN.MENU.CATALOGS.CITIES',
                        state: 'triangular.admin-default.catalogo-municipios',
                        permission: ['Administrador'],
                        type: 'link'
                    },{
                        name: 'MAIN.MENU.CATALOGS.STORES',
                        state: 'triangular.admin-default.catalogo-establecimientos',
                        permission: ['Administrador'],
                        type: 'link'
                    }
                ]
            }
        );

    }
})();

