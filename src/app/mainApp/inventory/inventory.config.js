(function () {
    'use strict';
    angular
        .module('app.mainApp.inventory')
        .config(moduleConfig);

    function moduleConfig(
        $stateProvider,
        $translatePartialLoaderProvider,
        triMenuProvider
    ) {
        $translatePartialLoaderProvider.addPart('app/mainApp/inventory');
        $stateProvider
            .state('triangular.admin-default.bulk-asset-inventory', {
                url: '/inventario/insumo_unico',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR']
                    }
                },
                templateUrl: 'app/mainApp/inventory/bulk_asset/bulk_asset.tmpl.html',
                controller: 'bulkAssetInventoryController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.unique-asset-inventory', {
                url: '/inventario/insumo_lote',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR']
                    }
                },
                templateUrl: 'app/mainApp/inventory/unique_asset/unique_asset.tmpl.html',
                controller: 'uniqueAssetInventoryController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.no_capitalizado', {
                url: '/no_capitalizado',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR']
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
                        only: ['ADMINISTRADOR']
                    }
                },
                templateUrl: 'app/mainApp/inventory/managementCabinet/cabinetGestion.tmpl.html',
                controller: 'cabinetGestionController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.storage', {
                url: '/inventario/posicionamiento',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR']
                    }
                },
                templateUrl: 'app/mainApp/inventory/cabinetStoring/cabinet_storing.tmpl.html',
                controller: 'cabinetStorageController',
                controllerAs: 'vm'
            });

        triMenuProvider.addMenu(
            {
                name: 'MAIN.MENU.INVENTORY.TITLE',
                icon: 'fa fa-archive',
                type: 'dropdown',
                permission: ['ADMINISTRADOR'],
                priority: 8,
                children: [{
                    name: 'MAIN.MENU.INVENTORY.CABINET_MANAGEMENT',
                    state: 'triangular.admin-default.gestion_cabinets',
                    type: 'link'
                },
                {
                    name: 'MAIN.MENU.INVENTORY.NO_CAPITALIZADO',
                    state: 'triangular.admin-default.no_capitalizado',
                    type: 'link'
                },
                {
                    name: 'MAIN.MENU.INVENTORY.STORAGE',
                    state: 'triangular.admin-default.storage',
                    type: 'link'
                },
                {
                    name: 'MAIN.MENU.INVENTORY.BULK_ASSET',
                    state: 'triangular.admin-default.bulk-asset-inventory',
                    type: 'link'
                },
                {
                    name: 'MAIN.MENU.INVENTORY.UNIQUE_ASSET',
                    state: 'triangular.admin-default.unique-asset-inventory',
                    type: 'link'
                }
                ]
            }
        );

    }

})();
