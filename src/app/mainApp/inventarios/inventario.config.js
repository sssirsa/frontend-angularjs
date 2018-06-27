/**
 * Created by franciscojaviercerdamartinez on 20/07/16.
 */
(function () {
    'use strict';
    angular
        .module('app.mainApp.inventario')
        .config(moduleConfig);

    function moduleConfig($stateProvider, $translatePartialLoaderProvider, triMenuProvider) {
        $translatePartialLoaderProvider.addPart('app/mainApp/inventarios');
        $stateProvider
            .state('triangular.admin-default.cabinets', { //Nombre del state
                url: '/cabinets', //Nombre que quiero en mi url
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'CAPTURISTA']
                    }
                },
                templateUrl: 'app/mainApp/inventarios/cabinet/cabinet.tmpl.html', //Dirección del archivo a usar
                controller: 'cabinetController', //nombre del controlador
                controllerAs: 'vm' //se renombra al scope
            })
            .state('triangular.admin-default.insumos', { //Nombre del state
                url: '/insumos', //Nombre que quiero en mi url
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'CAPTURISTA']
                    }
                },
                templateUrl: 'app/mainApp/inventarios/insumo/insumo.tmpl.html', //Dirección del archivo a usar
                controller: 'insumoController', //nombre del controlador
                controllerAs: 'vm' //se renombra al scope
            });

        triMenuProvider.addMenu(
            {
                name: 'MAIN.MENU.INVENTORY.TITLE',
                icon: 'fa fa-archive',
                type: 'dropdown',
                permission: ['ADMINISTRADOR', 'CAPTURISTA'],
                priority: 8,
                children: [{
                    name: 'MAIN.MENU.INVENTORY.CABINETS',
                    state: 'triangular.admin-default.cabinets',
                    type: 'link'
                }, {
                    name: 'MAIN.MENU.INVENTORY.CONSUMABLES',
                    state: 'triangular.admin-default.insumos',
                    type: 'link'
                }
                ]
            }
        );

    }

})();
