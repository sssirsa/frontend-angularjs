(function () {
    'use strict';

    angular
        .module('app.mainApp.catalogos')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, $translatePartialLoaderProvider) {
        $translatePartialLoaderProvider.addPart('app/mainApp/catalogos');
        $stateProvider

            .state('triangular.admin-default.proveedor', {
                // set the url of this page
                url: '/proveedor',
                // set the html template to show on this page
                templateUrl: 'app/mainApp/catalogos/proveedor/proveedor.tmpl.html',
                // set the controller to load for this page
                controller: 'ProveedorController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.linea-transporte', {
                // set the url of this page
                url: '/lineaTransporte',
                // set the html template to show on this page
                templateUrl: 'app/mainApp/catalogos/lineaTransporte/lineaTransporte.tmpl.html',
                // set the controller to load for this page
                controller: 'LineaTransporteController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.tipo-transporte', {
                // set the url of this page
                url: '/tipoTransporte',
                // set the html template to show on this page
                templateUrl: 'app/mainApp/catalogos/tipoTransporte/tipoTransporte.tmpl.html',
                // set the controller to load for this page
                controller: 'TipoTransporteController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.udn-catalog', {
                // set the url of this page
                url: '/udn',
                // set the html template to show on this page
                templateUrl: 'app/mainApp/catalogos/udn/udn.tmpl.html',
                // set the controller to load for this page
                controller: 'UDNController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.sucursal', {
                // set the url of this page
                url: '/sucursal',
                // set the html template to show on this page
                templateUrl: 'app/mainApp/catalogos/sucursal/sucursal.tmpl.html',
                // set the controller to load for this page
                controller: 'SucursalController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.model-cabinet', {
                // set the url of this page
                url: '/modelCabinet',
                // set the html template to show on this page
                templateUrl: 'app/mainApp/catalogos/modeloCabinet/modeloCabinet.tmpl.html',
                // set the controller to load for this page
                controller: 'ModeloCabinetController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.marca-cabinet', {
                // set the url of this page
                url: '/marcaCabinet',
                // set the html template to show on this page
                templateUrl: 'app/mainApp/catalogos/marcaCabinet/marcaCabinet.tmpl.html',
                // set the controller to load for this page
                controller: 'MarcaCabinetController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.proyectos',{
                url:'/proyectos',
                templateUrl:'app/mainApp/catalogos/proyectos/proyectos.tmpl.html',
                controller:'proyectosController',
                controllerAs:'vm'
            })
            .state('triangular.admin-default.clientes',{
                url:'/clientes',
                templateUrl:'app/mainApp/catalogos/clientes/cliente.tmpl.html',
                controller:'clienteController',
                controllerAs:'vm'
            })
            .state('triangular.admin-default.categoria',{
                url:'/categoria',
                templateUrl:'app/mainApp/catalogos/categoria/categoria.tmpl.html',
                controller:'CategoriaController',
                controllerAs:'vm'
            })
            .state('triangular.admin-default.catalogo-insumo',{
                url:'/catalogo-insumo',
                templateUrl:'app/mainApp/catalogos/catalogo_insumo/catalogo_insumo.tmpl.html',
                controller:'CatalogoInsumoController',
                controllerAs:'vm'
            });

    }
})();

