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
                url: '/inventario/insumo_lote',
                data: {
                    permissions: {
                        only: ['inventory__management__bulk_asset_branch']
                    }
                },
                templateUrl: 'app/mainApp/inventory/bulk_asset/bulk_asset.tmpl.html',
                controller: 'bulkAssetInventoryController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.unique-asset-inventory', {
                url: '/inventario/insumo_unico',
                data: {
                    permissions: {
                        only: ['inventory__management__unique_asset_branch']
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
                        only: ['management__inventory__no_labeled']
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
                        only: ['management__inventory__cabinet']
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
                        only: ['management__inventory__asset_location']
                    }
                },
                templateUrl: 'app/mainApp/inventory/cabinetStoring/cabinet_storing.tmpl.html',
                controller: 'cabinetStorageController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.bulk-asset-stage', {
                url: '/inventario/insumo_lote_etapa',
                data: {
                    permissions: {
                        only: ['inventory__asset__bulk_asset_process']
                    }
                },
                templateUrl: 'app/mainApp/inventory/bulk_asset_stage/bulk_asset_stage.tmpl.html',
                controller: 'bulkAssetStageController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.unique-asset-stage', {
                url: '/inventario/insumo_unico_etapa',
                data: {
                    permissions: {
                        only: ['inventory__asset__unique_asset_process']
                    }
                },
                templateUrl: 'app/mainApp/inventory/unique_asset_stage/unique_asset_stage.tmpl.html',
                controller: 'uniqueAssetStageController',
                controllerAs: 'vm'
            });

        triMenuProvider.addMenu(
            {
                name: 'MAIN.MENU.INVENTORY.TITLE',
                icon: 'fa fa-archive',
                type: 'dropdown',
                permission: [
                    'management__inventory__cabinet',
                    'management__inventory__no_labeled',
                    'management__inventory__asset_location',
                    'inventory__management__bulk_asset_branch',
                    'inventory__management__unique_asset_branch',
                    'inventory__asset__bulk_asset_process',
                    'inventory__asset__unique_asset_process'
                ],
                priority: 8,
                children: [{
                    name: 'MAIN.MENU.INVENTORY.CABINET_MANAGEMENT',
                    state: 'triangular.admin-default.gestion_cabinets',
                    permission:['management__inventory__cabinet'],
                    type: 'link'
                },
                {
                    name: 'MAIN.MENU.INVENTORY.NO_CAPITALIZADO',
                    state: 'triangular.admin-default.no_capitalizado',
                    permission: ['management__inventory__no_labeled'],
                    type: 'link'
                },
                {
                    name: 'MAIN.MENU.INVENTORY.STORAGE',
                    state: 'triangular.admin-default.storage',
                    permission: ['management__inventory__asset_location'],
                    type: 'link'
                },
                {
                    name: 'MAIN.MENU.INVENTORY.BULK_ASSET',
                    state: 'triangular.admin-default.bulk-asset-inventory',
                    permission:'inventory__management__bulk_asset_branch',
                    type: 'link'
                },
                {
                    name: 'MAIN.MENU.INVENTORY.UNIQUE_ASSET',
                    state: 'triangular.admin-default.unique-asset-inventory',
                    permission: 'inventory__management__unique_asset_branch',
                    type: 'link'
                },
                {
                    name: 'MAIN.MENU.INVENTORY.BULK_ASSET_STAGE',
                    state: 'triangular.admin-default.bulk-asset-stage',
                    permission: ['inventory__asset__bulk_asset_process'],
                    type: 'link'
                },
                {
                    name: 'MAIN.MENU.INVENTORY.UNIQUE_ASSET_STAGE',
                    state: 'triangular.admin-default.unique-asset-stage',
                    permission: ['inventory__asset__unique_asset_process'],
                    type: 'link'
                }
                ]
            }
        );

    }

})();
