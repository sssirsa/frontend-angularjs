(function () {
    'use strict';
    angular
        .module('app.mainApp.inventory')
        .config(moduleConfig);

    function moduleConfig($stateProvider, $translatePartialLoaderProvider, triMenuProvider) {
        $translatePartialLoaderProvider.addPart('app/mainApp/inventory');
        $stateProvider
            /*.state('triangular.admin-default.cabinets', {
                url: '/cabinets',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'CAPTURISTA']
                    }
                },
                templateUrl: 'app/mainApp/inventory/cabinet/cabinet.tmpl.html',
                controller: 'cabinetController',
                controllerAs: 'vm'
            })*/
            .state('triangular.admin-default.insumos', {
                url: '/insumos',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'CAPTURISTA']
                    }
                },
                templateUrl: 'app/mainApp/inventory/insumo/insumo.tmpl.html',
                controller: 'insumoController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.no_capitalizado', {
                url: '/no_capitalizado',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'CAPTURISTA']
                    }
                },
                templateUrl: 'app/mainApp/inventory/notCapitalized/noCapitalizado.tmpl.html',
                controller: 'noCapitalizadoController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.gestion_cabinets', {
                url: '/cabinet',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'CAPTURISTA']
                    }
                },
                templateUrl: 'app/mainApp/inventory/managementCabinet/cabinetGestion.tmpl.html',
                controller: 'cabinetGestionController',
                controllerAs: 'vm'
            });

        triMenuProvider.addMenu(
            {
                name: 'MAIN.MENU.INVENTORY.TITLE',
                icon: 'fa fa-archive',
                type: 'dropdown',
                permission: ['ADMINISTRADOR', 'CAPTURISTA'],
                priority: 8,
                children: [{
                    name: 'MAIN.MENU.INVENTORY.CABINET_MANAGEMENT',
                    state: 'triangular.admin-default.gestion_cabinets',
                    type: 'link'
                }/*, {
                    name: 'MAIN.MENU.INVENTORY.CABINETS',
                    state: 'triangular.admin-default.cabinets',
                    type: 'link'
                }*/, {
                    name: 'MAIN.MENU.INVENTORY.CONSUMABLES',
                    state: 'triangular.admin-default.insumos',
                    type: 'link'
                }, {
                    name: 'MAIN.MENU.INVENTORY.NO_CAPITALIZADO',
                    state: 'triangular.admin-default.no_capitalizado',
                    type: 'link'
                }
                ]
            }
        );

    }

})();
